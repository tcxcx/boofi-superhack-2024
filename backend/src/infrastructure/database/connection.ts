import pgPromise from "pg-promise";
import { IConnectionParameters } from "pg-promise/typescript/pg-subset";

const dbConfig: IConnectionParameters = {
  host: process.env.PG_HOST || "localhost",
  port: parseInt(process.env.PG_PORT || "5432"),
  user: process.env.PG_USER || "boofi_user",
  password: process.env.PG_PASSWORD || "boofi_password",
  database: process.env.PG_DB || "boofi_db",
};

const pgp = pgPromise();
const db = pgp(dbConfig);

export default db;
