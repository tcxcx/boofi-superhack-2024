import express from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "@/application/services/UserService";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";

const router = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post("/", userController.createUser.bind(userController));
router.get("/:id", userController.getUser.bind(userController));
router.put("/:id", userController.updateUser.bind(userController));
router.delete("/:id", userController.deleteUser.bind(userController));

export default router;
