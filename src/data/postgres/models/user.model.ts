import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { encriptAdapter } from "../../../config";

 import { Repair } from "./repair.model";
import { Box } from "./box.model";
 import { Pin } from "./pin.model";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}

//TODO borrar al final
export enum UserRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {
    length: 80,
    nullable: false,
  })
  name: string;

  
  @Column("varchar", {
    length: 80,
    nullable: false,
  })
  surname: string;

  @Column("varchar", {
    length: 80,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column("varchar", {
    length: 15,
    nullable: false,
  })
  cellphone: string;

  @Column("varchar", {
    nullable: false,
  })
  password: string;

  

  @Column("enum", {
    enum: UserStatus,
    default: UserStatus.INACTIVE,
  })
  status: UserStatus;   

  @OneToMany(() => Repair, (repair) => repair.user)
  repairs: Repair[];  
 
  @OneToMany(() => Box, (box) => box.user)
  boxes: Box[]; 

  @OneToMany(() => Pin, (pin) => pin.user)
  pins: Pin[];  

  @BeforeInsert()
  encryptedPassword() {
    this.password = encriptAdapter.hash(this.password);
  }
}
