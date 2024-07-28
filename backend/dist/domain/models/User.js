"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, email, walletAddress, worldIdVerified, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.walletAddress = walletAddress;
        this.worldIdVerified = worldIdVerified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromDatabase(data) {
        return new User(data.id, data.email, data.wallet_address, data.world_id_verified, data.created_at, data.updated_at);
    }
    toDatabase() {
        return {
            id: this.id,
            email: this.email,
            wallet_address: this.walletAddress,
            world_id_verified: this.worldIdVerified,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
        };
    }
}
exports.User = User;
