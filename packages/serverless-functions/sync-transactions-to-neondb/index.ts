import { Client, Databases } from "node-appwrite";
import { neon } from "@neondatabase/serverless";

const {
  NEON_DATABASE_URL,
  APPWRITE_ENDPOINT,
  APPWRITE_FUNCTION_PROJECT_ID,
  APPWRITE_API_KEY,
} = process.env;

export default async function ({
  req,
  res,
  log,
  error,
}: {
  req: any;
  res: any;
  log: (message: string) => void;
  error: (message: string) => void;
}) {
  const client = new Client();

  client
    .setEndpoint(APPWRITE_ENDPOINT!)
    .setProject(APPWRITE_FUNCTION_PROJECT_ID!)
    .setKey(APPWRITE_API_KEY!);

  const database = new Databases(client);
  const sql = neon(NEON_DATABASE_URL!);

  try {
    const payload = req.body;

    const parsedPayload = JSON.parse(payload);
    const { eventName, data } = parsedPayload;

    if (eventName.includes("create") || eventName.includes("update")) {
      const { document } = data;

      if (document.format === "blockchain" && document.address) {
        await sql`
          INSERT INTO verified_credentials (user_wallet, format, address, chain)
          VALUES (${document.address}, ${document.format}, ${document.address}, ${document.chain})
          ON CONFLICT (user_wallet) DO UPDATE
          SET address = EXCLUDED.address,
              chain = EXCLUDED.chain;`;

        log("Synced verified credentials to NeonDB");
      }
    }

    return res.json({ success: true });
  } catch (err) {
    const errorMessage = (err as Error).message || "Unknown error";
    error(`Error processing data: ${errorMessage}`);
    return res.status(500).json({ error: "Error processing data" });
  }
}
