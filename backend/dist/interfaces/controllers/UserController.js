"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async createUser(req, res) {
        try {
            const { email, walletAddress } = req.body;
            const user = await this.userService.createUser(email, walletAddress);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to create user" });
        }
    }
    async getUser(req, res) {
        try {
            const user = await this.userService.getUserById(req.params.id);
            if (user) {
                res.json(user);
            }
            else {
                res.status(404).json({ error: "User not found" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "Failed to get user" });
        }
    }
    async updateUser(req, res) {
        try {
            const { email, walletAddress, worldIdVerified } = req.body;
            const user = await this.userService.getUserById(req.params.id);
            if (user) {
                user.email = email || user.email;
                user.walletAddress = walletAddress || user.walletAddress;
                user.worldIdVerified = worldIdVerified !== null && worldIdVerified !== void 0 ? worldIdVerified : user.worldIdVerified;
                const updatedUser = await this.userService.updateUser(user);
                res.json(updatedUser);
            }
            else {
                res.status(404).json({ error: "User not found" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "Failed to update user" });
        }
    }
    async deleteUser(req, res) {
        try {
            await this.userService.deleteUser(req.params.id);
            res.status(204).end();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete user" });
        }
    }
}
exports.UserController = UserController;
