"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_appwrite_1 = require("node-appwrite");
const serverless_1 = require("@neondatabase/serverless");
const crypto_1 = __importDefault(require("crypto"));
const { NEON_DATABASE_URL, APPWRITE_ENDPOINT, APPWRITE_FUNCTION_PROJECT_ID, APPWRITE_API_KEY, APPWRITE_WEBHOOK_SECRET, } = process.env;
async function default_1({ req, res, log, error, }) {
    const client = new node_appwrite_1.Client();
    client
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(APPWRITE_API_KEY);
    const database = new node_appwrite_1.Databases(client);
    const sql = (0, serverless_1.neon)(NEON_DATABASE_URL);
    try {
        const payload = req.body; // Raw body to validate signature
        const signature = req.headers["x-appwrite-webhook-signature"]; // Get signature header
        // Validate the signature
        const computedSignature = crypto_1.default
            .createHmac("sha1", APPWRITE_WEBHOOK_SECRET)
            .update(payload)
            .digest("hex");
        if (computedSignature !== signature) {
            error("Invalid webhook signature");
            return res.status(401).json({ error: "Invalid webhook signature" });
        }
        // Parse the payload after verifying the signature
        const parsedPayload = JSON.parse(payload);
        const { eventName, data } = parsedPayload;
        if (eventName.includes("create") || eventName.includes("update")) {
            const { document } = data;
            if (document.format === "blockchain" && document.address) {
                await sql `
          INSERT INTO verified_credentials (user_wallet, format, address, chain)
          VALUES (${document.address}, ${document.format}, ${document.address}, ${document.chain})
          ON CONFLICT (user_wallet) DO UPDATE
          SET address = EXCLUDED.address,
              chain = EXCLUDED.chain;`;
                log("Synced verified credentials to NeonDB");
            }
        }
        return res.json({ success: true });
    }
    catch (err) {
        const errorMessage = err.message || "Unknown error";
        error(`Error processing webhook: ${errorMessage}`);
        return res.status(500).json({ error: "Error processing webhook" });
    }
}
exports.default = default_1;
