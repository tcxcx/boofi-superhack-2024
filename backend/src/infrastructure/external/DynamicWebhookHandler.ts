// src/infrastructure/external/DynamicWebhookHandler.ts

import { UserService } from "@/application/services/UserService";
import { User } from "@/domain/models/User";
import { DynamicClient } from "./DynamicClient";

export class DynamicWebhookHandler {
  private dynamicClient: DynamicClient;

  constructor(private userService: UserService) {
    this.dynamicClient = new DynamicClient();
  }

  async handleWebhook(data: any) {
    const { userId } = data;
    const dynamicUser = await this.dynamicClient.getUser(userId);
    await this.userService.createOrUpdateUser(dynamicUser);
  }
}
