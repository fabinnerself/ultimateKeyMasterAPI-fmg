import { DataSource } from "typeorm";
import { User } from "./models/user.model";
//TODO elimianr al final
import { Repair } from "./models/repair.model";
import { Box } from "./models/box.model";
import { Credential } from "./models/credential.model";
import { Pin } from "./models/pin.model"
 

interface Options {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export class PostgresDatabase {
  public datasource: DataSource;

  constructor(options: Options) {
    this.datasource = new DataSource({
      type: "postgres",
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
      database: options.database,      
      entities: [User, Repair, Box, Credential, Pin],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  async connect() {
    try {
      await this.datasource.initialize();
      console.log("DataBase Conected 🆗😀");  
    } catch (error) {
      console.log(error);
    }
  }
}
