import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable("users", {
    id: "uuid",
    email: { type: "string", notNull: true, unique: true },
    alias: "string",
    first_name: "string",
    last_name: "string",
    username: { type: "string", unique: true },
    world_id_verified: { type: "boolean", default: false },
    metadata: "jsonb",
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable("users");
};
