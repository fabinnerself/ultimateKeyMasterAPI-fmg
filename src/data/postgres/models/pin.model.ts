import {
    BaseEntity,   
    Column,
    Entity,    
    JoinColumn,
    ManyToOne,
    BeforeInsert,    
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { encriptAdapter } from "../../../config";

  import {Credential} from "./credential.model";  
  import {User} from "./user.model";  
  
  export enum Pin_Status {
    ACTIVE = "ACTIVE",    
    DELETED = "DELETED",
  }  

  @Entity()
  export class Pin extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", {        
        nullable: false,
    })
    pin_code: string;  

    @Column("enum", {
      enum: Pin_Status,
      default: Pin_Status.ACTIVE,
    })
    pin_status: Pin_Status;   
    
    @ManyToOne(() => User, (user) => user.pins)
    @JoinColumn({ name: "idUser" })
    user: User;        

    @ManyToOne(() => Credential, (credential) => credential.pins)
    @JoinColumn({ name: "idCredential" })
    credential: Credential;       

    @BeforeInsert()
    encryptedPassword() {
      this.pin_code = encriptAdapter.hash(this.pin_code);
    }

  }