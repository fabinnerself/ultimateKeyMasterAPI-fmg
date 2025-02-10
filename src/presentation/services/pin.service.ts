import { Pin, Pin_Status } from "../../data";

import { CredentialService } from "../services/credential.service";
import { CustomError, RegisterPinDTO, UpdatePinDTO } from "../../domain";

export class PinService {
  constructor(private readonly credService: CredentialService) { }

  async findAllPinServ() {

    try {
      return await Pin.find({
        where: {
          pin_status: Pin_Status.ACTIVE
        },
      });
    } catch (error: any) {
      throw CustomError.internalServer("Error geting data from pin");
    }
  }

  async findOnePinServ(id: string) {

    const pin_found = await Pin.findOne({
      where: {
        id,
        pin_status: Pin_Status.ACTIVE
      },
    });

    if (!pin_found) {

      throw CustomError.notFoud("The pin provided not found");
    }

    return pin_found;
  }

  async deletePinServ(id: string) {

    const pin_found = await this.findOnePinServ(id);

    pin_found.pin_status = Pin_Status.DELETED;

    try {
      await pin_found.save();
      return { message: "Pin record deleted successfully " };
    } catch (error) {
      throw CustomError.internalServer("Error deleting pin");
    }
  }

  async createPinServ(pinData: RegisterPinDTO) {

    const credential_found = await this.credService.findOneCredentialServ(pinData.idCredential);

    const newPin = new Pin()

    newPin.pin_code = pinData.pin;
    newPin.credential = credential_found;

    try {
      const pinDB = await newPin.save();


      return {
        id: pinDB.id,
        credential: {
          id: credential_found.id,
          account: credential_found.credential_name,
          description: credential_found.credential_description
        }
      };

    } catch (error: any) {

      throw CustomError.internalServer("Error creating pin");
    }
  }

  async updatePinServ(id: string, pinData: UpdatePinDTO) {
    const pin_found = await this.findOnePinServ(id);

    pin_found.pin_code = pinData.pin;

    try {

      const pinDB = await pin_found.save();

      return {
        id: pinDB.id,
        status: pinDB.pin_status

      };

    } catch (error: any) {

      throw CustomError.internalServer("Error updating pin");
    }
  }

}