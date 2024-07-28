import run, { RunnerOption } from "node-pg-migrate";
import pgPromise from "pg-promise";
import { IConnectionParameters } from "pg-promise/typescript/pg-subset";
import dotenv from "dotenv";

dotenv.config();

let dbMigrationOptions: RunnerOption | undefined;

export async function setupDatabase() {
  if (!dbMigrationOptions) {
    await initMigrations();
  }
  if (dbMigrationOptions) {
    await run({ ...dbMigrationOptions, direction: "up" });
  }
}

export async function upgradeDatabase(steps?: number) {
  if (!dbMigrationOptions) {
    await initMigrations();
  }
  if (dbMigrationOptions) {
    await run({ ...dbMigrationOptions, direction: "up", count: steps });
  }
}

export async function downgradeDatabase(steps?: number) {
  if (!dbMigrationOptions) {
    await initMigrations();
  }
  if (dbMigrationOptions) {
    await run({ ...dbMigrationOptions, direction: "down", count: steps });
  }
}

export async function clearDatabase() {
  if (!dbMigrationOptions) {
    await initMigrations();
  }
  if (dbMigrationOptions) {
    await run({ ...dbMigrationOptions, direction: "down", count: Infinity });
  }
}

export async function rebuildDatabase() {
  if (!dbMigrationOptions) {
    await initMigrations();
  }
  if (dbMigrationOptions) {
    await run({ ...dbMigrationOptions, direction: "down", count: Infinity });
    await run({ ...dbMigrationOptions, direction: "up" });
  }
}

export async function dropDatabase() {
  if (!dbMigrationOptions) {
    await initMigrations();
  }
  if (dbMigrationOptions) {
    await run({ ...dbMigrationOptions, direction: "down", count: Infinity });
  }
}

async function initMigrations() {
  const dbConfig: IConnectionParameters = {
    host: process.env.PG_HOST || "",
    port: parseInt(process.env.PG_PORT || "5432"),
    user: process.env.PG_USER || "",
    password: process.env.PG_PASSWORD || "",
    database: process.env.PG_DB || "",
  };

  const connectionString = `postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
  dbMigrationOptions = {
    databaseUrl: process.env.DATABASE_URL || connectionString,
    dir: `./src/migrations/`,
    migrationsTable: "migrations",
    direction: "up", // Default direction
  };
}
