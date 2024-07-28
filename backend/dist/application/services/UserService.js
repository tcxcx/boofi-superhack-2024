"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("@/domain/models/User");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(email, walletAddress) {
        const user = new User_1.User("", email, walletAddress, false, new Date(), new Date());
        return this.userRepository.create(user);
    }
    async getUserById(id) {
        return this.userRepository.findById(id);
    }
    async updateUser(user) {
        return this.userRepository.update(user);
    }
    async deleteUser(id) {
        return this.userRepository.delete(id);
    }
}
exports.UserService = UserService;
