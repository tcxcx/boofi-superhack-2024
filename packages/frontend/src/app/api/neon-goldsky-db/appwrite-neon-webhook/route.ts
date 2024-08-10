import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

const {
  NEON_DATABASE_URL: NEON_DATABASE,
  APPWRITE_WEBHOOK_SECRET: WEBHOOK_SECRET,
} = process.env;

console.log("NEON_DATABASE_URL:", NEON_DATABASE);

const sql = neon(
  "postgresql://boofi-superhack-2024_owner:vxoSVgBJ9u3R@ep-tiny-darkness-a5adlxuu.us-east-2.aws.neon.tech/boofi-superhack-2024?sslmode=require"!
);

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-appwrite-webhook-signature");

    const computedSignature = crypto
      .createHmac("sha1", WEBHOOK_SECRET!)
      .update(JSON.stringify(await req.json()))
      .digest("hex");

    if (computedSignature !== signature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    const { eventName, data } = await req.json();

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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}
