import dotenv from "dotenv";

dotenv.config();

export const config = {
  dynamicEnvironmentId: process.env.DYNAMIC_ENVIRONMENT_ID,
  dynamicBearerToken: process.env.DYNAMIC_BEARER_TOKEN,
};

if (!config.dynamicEnvironmentId || !config.dynamicBearerToken) {
  throw new Error("Missing required Dynamic configuration");
}
