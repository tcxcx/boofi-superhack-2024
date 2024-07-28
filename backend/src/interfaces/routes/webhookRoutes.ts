import express from "express";
import { DynamicWebhookHandler } from "@/infrastructure/external/DynamicWebhookHandler";
import { UserService } from "@/application/services/UserService";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";

const router = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const dynamicWebhookHandler = new DynamicWebhookHandler(userService);

router.post("/dynamic", async (req, res) => {
  try {
    await dynamicWebhookHandler.handleWebhook(req.body);
    res.status(200).send("Webhook processed successfully");
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Error processing webhook");
  }
});

export default router;
