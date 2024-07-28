"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("@/interfaces/controllers/UserController");
const UserService_1 = require("@/application/services/UserService");
const UserRepository_1 = require("@/infrastructure/repositories/UserRepository");
const router = express_1.default.Router();
const userRepository = new UserRepository_1.UserRepository();
const userService = new UserService_1.UserService(userRepository);
const userController = new UserController_1.UserController(userService);
router.post("/", userController.createUser.bind(userController));
router.get("/:id", userController.getUser.bind(userController));
router.put("/:id", userController.updateUser.bind(userController));
router.delete("/:id", userController.deleteUser.bind(userController));
exports.default = router;
