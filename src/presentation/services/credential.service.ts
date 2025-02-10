import { Box, Credential, CredentialStatus } from "../../data";
import { BoxService } from "../services/box.service";
import {  CustomError,  RegisterCredentialDTO , UpdateCredentialDTO   } from "../../domain"; 
import {generateRandomString} from "../../config/random-adapter"

export class CredentialService { 
  constructor(private readonly boxService: BoxService) {}

  async findAllCredentialServ(idBox:string) { 
    const box_found = await this.boxService.findOneBoxServ(idBox)

    try {
      
      const credentialDb = await Credential.find({          
        where: {
          box: { id: idBox } ,
          credential_status:CredentialStatus.ACTIVE
        }
      });

      return credentialDb.map(credential => ({
        id: credential.id,
        name: credential.credential_name,
        description: credential.credential_description,
        box: { idBox: box_found.id, name: box_found.box_name }        
      }));
    } catch (error: any) {
      throw CustomError.internalServer("Error geting data from credential");
    }
  }

  async findOneCredentialServ(id: string){
    const credential_found = await Credential.findOne({
        where: {
          id  ,
          credential_status:CredentialStatus.ACTIVE
        },
      });
  
      if (!credential_found) {        
        throw CustomError.notFoud("A Credential not found");
      }
  
      return credential_found; 
  }

  async deleteCredentialServ (id: string){
 
    const credential_found = await this.findOneCredentialServ(id); 

    credential_found.credential_status = CredentialStatus.DELETED;

    try {
      await credential_found.save();
      return { message:"Credential record deleted successfully" };
    } catch (error) {
      throw CustomError.internalServer("Error deleting Credential");
    }    
  }

  async createCredentialServ (credentialData: RegisterCredentialDTO){
    const box_found = await this.boxService.findOneBoxServ(credentialData.idBox);

    const newCredential = new Credential()

    newCredential.credential_name = credentialData.name;    
    newCredential.credential_description = credentialData.description;
    newCredential.credential_password = credentialData.password;
    
    if(credentialData.code1)
      newCredential.credential_code1 = credentialData.code1;

    if(credentialData.code2)
      newCredential.credential_code2 = credentialData.code2;
    
    newCredential.box = box_found;

    try {
        const credentialDB = await newCredential.save();

        return {
          id: credentialDB.id,
          account:credentialDB.credential_name,
          description:credentialDB.credential_description,
          idBox:{
            idBox:box_found.id,
            name:box_found.box_name
          }          
        };

      } catch (error:any) {  

        throw CustomError.internalServer("Error creating Credential");
      }
  }

  async updateCredentialServ (id: string,dataCredential:UpdateCredentialDTO ){
    const credential_found = await this.findOneCredentialServ(id); 
  
    credential_found.credential_name = dataCredential.name;
    credential_found.credential_description = dataCredential.description;
    credential_found.credential_password = dataCredential.password;

    if(dataCredential.code1)
      credential_found.credential_code1 = dataCredential.code1;

    if(dataCredential.code2)
      credential_found.credential_code2 = dataCredential.code2;    

    try {
        const credentialDB =  await credential_found.save();         

        return {
          id: credentialDB.id,
          account:credentialDB.credential_name,
          description:credentialDB.credential_description 
        };

      } catch (error: any) {
       
        throw CustomError.internalServer("Error updating Credential");
      }
  }  

  async generateCredentialServ() {
    const KeyGen = { "generatedKey":generateRandomString(12) }
    return KeyGen;
  }

 
}