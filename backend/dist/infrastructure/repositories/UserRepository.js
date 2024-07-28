"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("@/domain/models/User");
const connection_1 = __importDefault(require("@/infrastructure/database/connection"));
class UserRepository {
    async create(user) {
        const { rows } = await connection_1.default.query("INSERT INTO users (email, wallet_address, world_id_verified) VALUES ($1, $2, $3) RETURNING *", [user.email, user.walletAddress, user.worldIdVerified]);
        return User_1.User.fromDatabase(rows[0]);
    }
    async findById(id) {
        const { rows } = await connection_1.default.query("SELECT * FROM users WHERE id = $1", [
            id,
        ]);
        return rows.length ? User_1.User.fromDatabase(rows[0]) : null;
    }
    async update(user) {
        const { rows } = await connection_1.default.query("UPDATE users SET email = $1, wallet_address = $2, world_id_verified = $3, updated_at = NOW() WHERE id = $4 RETURNING *", [user.email, user.walletAddress, user.worldIdVerified, user.id]);
        return User_1.User.fromDatabase(rows[0]);
    }
    async delete(id) {
        await connection_1.default.query("DELETE FROM users WHERE id = $1", [id]);
    }
}
exports.UserRepository = UserRepository;
