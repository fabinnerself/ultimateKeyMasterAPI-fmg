CREATE TYPE "sec_status" AS ENUM (
  'ACTIVE',
  'DELETED'
);

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "surname" varchar(100) NOT NULL,
  "email" varchar(150) UNIQUE NOT NULL,
  "cellphone" varchar(20) UNIQUE NOT NULL,
  "password" varchar(255) NOT NULL,
  "status" boolean DEFAULT true
);

CREATE TABLE "security_box" (
  "id" uuid PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "favorite" boolean DEFAULT true,
  "icon" varchar(20) NOT NULL,
  "status" sec_status DEFAULT 'ACTIVE',
  "user_id" uuid NOT NULL
);

CREATE TABLE "credential_storage" (
  "id" uuid PRIMARY KEY,
  "account" varchar(100) NOT NULL,
  "password" varchar(255) NOT NULL,
  "description" text,
  "code_1" varchar(20),
  "code_2" varchar(20),
  "security_box_id" uuid NOT NULL,
  "pin_id" uuid NOT NULL
);

CREATE TABLE "pin" (
  "id" uuid PRIMARY KEY,
  "code" varchar(6)
);

ALTER TABLE "security_box" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "credential_storage" ADD FOREIGN KEY ("security_box_id") REFERENCES "security_box" ("id");

ALTER TABLE "credential_storage" ADD FOREIGN KEY ("pin_id") REFERENCES "pin" ("id");
