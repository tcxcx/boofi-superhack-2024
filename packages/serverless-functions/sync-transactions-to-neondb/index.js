"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_appwrite_1 = require("node-appwrite");
const serverless_1 = require("@neondatabase/serverless");
const { NEON_DATABASE_URL } = process.env;
async function default_1({ req, res, log, error, }) {
    const client = new node_appwrite_1.Client();
    client
        .setEndpoint("https://cloud.appwrite.io/v1")
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);
    const database = new node_appwrite_1.Databases(client);
    const sql = (0, serverless_1.neon)(NEON_DATABASE_URL);
    try {
        const payload = JSON.parse(req.body);
        const { eventName, data } = payload;
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
