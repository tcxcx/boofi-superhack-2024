import { User } from "@/domain/models/User";
import db from "@/infrastructure/database/connection";

export class UserRepository {
  async create(user: User): Promise<User> {
    const query = `INSERT INTO users (id, email, alias, first_name, last_name, username, world_id_verified, metadata, created_at, updated_at) 
                   VALUES (\${id}, \${email}, \${alias}, \${first_name}, \${last_name}, \${username}, \${world_id_verified}, \${metadata}, \${created_at}, \${updated_at})
                   RETURNING *`;
    const result = await db.one(query, user.toDatabase());
    return User.fromDatabase(result);
  }

  async findById(id: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await db.oneOrNone(query, id);
    return result ? User.fromDatabase(result) : null;
  }

  async update(user: User): Promise<User> {
    const query = `UPDATE users SET email = \${email}, alias = \${alias}, first_name = \${first_name}, last_name = \${last_name}, username = \${username}, world_id_verified = \${world_id_verified}, metadata = \${metadata}, updated_at = \${updated_at}
                   WHERE id = \${id}
                   RETURNING *`;
    const result = await db.one(query, user.toDatabase());
    return User.fromDatabase(result);
  }

  async delete(id: string): Promise<void> {
    const query = "DELETE FROM users WHERE id = $1";
    await db.none(query, id);
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await db.oneOrNone(query, email);
    return result ? User.fromDatabase(result) : null;
  }
}
