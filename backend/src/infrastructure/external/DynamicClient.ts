// src/infrastructure/external/DynamicClient.ts

import axios from "axios";
import { config } from "@/config";

export class DynamicClient {
  private baseUrl = "https://app.dynamicauth.com/api/v0";

  private async request(method: string, path: string, data?: any) {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      Authorization: `Bearer ${config.dynamicBearerToken}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios({ method, url, headers, data });
      return response.data;
    } catch (error) {
      console.error("Error in Dynamic API request:", error);
      throw error;
    }
  }

  async getUser(userId: string) {
    return this.request("GET", `/users/${userId}`);
  }

  async updateUser(userId: string, userData: any) {
    return this.request("PUT", `/users/${userId}`, userData);
  }
}
