import { Client, Databases } from "node-appwrite";
import { neon } from "@neondatabase/serverless";

const { NEON_DATABASE_URL } = process.env;

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
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID as string)
    .setKey(process.env.APPWRITE_API_KEY as string);

  const database = new Databases(client);
  const sql = neon(NEON_DATABASE_URL as string);

  try {
    const payload = JSON.parse(req.body);
    const { eventName, data } = payload;

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
    error(`Error processing webhook: ${errorMessage}`);
    return res.status(500).json({ error: "Error processing webhook" });
  }
}
