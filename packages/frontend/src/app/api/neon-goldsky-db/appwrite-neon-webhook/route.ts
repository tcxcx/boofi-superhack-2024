import type { NextApiRequest, NextApiResponse } from "next";
import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

const {
  NEON_DATABASE_URL: NEON_DATABASE,
  APPWRITE_WEBHOOK_SECRET: WEBHOOK_SECRET,
} = process.env;

console.log("NEON_DATABASE_URL:", process.env.NEON_DATABASE);

const sql = neon(
  "postgresql://boofi-superhack-2024_owner:vxoSVgBJ9u3R@ep-tiny-darkness-a5adlxuu.us-east-2.aws.neon.tech/boofi-superhack-2024?sslmode=require"
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const signature = req.headers["x-appwrite-webhook-signature"] as string;

    const computedSignature = crypto
      .createHmac("sha1", WEBHOOK_SECRET!)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (computedSignature !== signature) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    const { eventName, data } = req.body;

    if (eventName.includes("create") || eventName.includes("update")) {
      const { document } = data;

      if (document.format === "blockchain" && document.address) {
        const userId = document.users;

        await sql`
          INSERT INTO verified_credentials (user_id, user_wallet, format, address, chain)
          VALUES (${userId}, ${document.address}, ${document.format}, ${document.address}, ${document.chain})
          ON CONFLICT (user_wallet) DO UPDATE
          SET address = EXCLUDED.address,
              chain = EXCLUDED.chain,
              user_id = EXCLUDED.user_id;`;
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(500).json({ error: "Error processing webhook" });
  }
}
