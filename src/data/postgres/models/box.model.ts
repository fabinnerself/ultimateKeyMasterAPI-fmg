import {
    BaseEntity,   
    Column,
    Entity,    
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { encriptAdapter } from "../../../config";

  import {User} from "./user.model";  
  import {Credential} from "./credential.model";  
  
  export enum BoxStatus {
    ACTIVE = "ACTIVE",    
    DELETED = "DELETED",
  }
  
  @Entity()
  export class Box extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column("varchar", {
      length: 100,
      nullable: false,
    })
    box_name: string;

    @Column("boolean",{
        nullable:true
    })
    box_favorite:boolean

    @Column("varchar", {
        length: 20,
        nullable: true,
      })
    box_icon: string;

    @Column("enum", {
        enum: BoxStatus ,
        default: BoxStatus.ACTIVE,
    })
    box_status: BoxStatus;

    @Column("timestamp", {               
      default: () => 'CURRENT_TIMESTAMP',      
    })
    box_date_created: Date

    @OneToMany(() => Credential, (credential) => credential.box)
    credentials: Credential[]; 

    @ManyToOne(() => User, (user) => user.boxes)
    @JoinColumn({ name: "idUser" })
    user: User;        

  }
