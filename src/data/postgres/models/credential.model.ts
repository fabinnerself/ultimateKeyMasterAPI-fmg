import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { encriptAdapter } from "../../../config";

import { Box } from "./box.model";
import { Pin } from "./pin.model";

export enum CredentialStatus {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
}

@Entity()
export class Credential extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {
    length: 80,
    nullable: false,
  })
  credential_name: string;

  @Column("varchar", {
    length: 200,
    nullable: false,
  })
  credential_password: string;

  @Column("varchar", {
    length: 480,
    nullable: true,
  })
  credential_description: string;

  @Column("varchar", {
    length: 200,
    nullable: true,
  })
  credential_code1: string;

  @Column("varchar", {
    length: 200,
    nullable: true,
  })
  credential_code2: string;

  @Column("enum", {
    enum: CredentialStatus,
    default: CredentialStatus.ACTIVE,
  })
  credential_status: CredentialStatus;

  @ManyToOne(() => Box, (box) => box.credentials)
  @JoinColumn({ name: "idBox" })
  box: Box;

  @OneToMany(() => Pin, (pin) => pin.credential)
  pins: Pin[];

  @BeforeInsert()
  encryptedPassword() {
    this.credential_password = encriptAdapter.hash(this.credential_password);
  }

}