"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_appwrite_1 = require("node-appwrite");
const serverless_1 = require("@neondatabase/serverless");
async function default_1({ req, res, log, error, }) {
    try {
        // Initialize Appwrite client using global environment variables
        const client = new node_appwrite_1.Client();
        client
            .setEndpoint(process.env.APPWRITE_PROJECT_ID)
            .setProject(process.env.APPWRITE_PROJECT_ID)
            .setKey(process.env.APPWRITE_API_KEY);
        const database = new node_appwrite_1.Databases(client);
        // Initialize NeonDB connection using the global environment variable
        const sql = (0, serverless_1.neon)(process.env.NEON_DATABASE_URL);
        const payload = req.body;
        // Parse the payload and handle the data accordingly
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
        error(`Error processing data: ${errorMessage}`);
        return res.status(500).json({ error: "Error processing data" });
    }
}
exports.default = default_1;
