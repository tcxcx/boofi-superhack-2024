// src/app/api/dynamic-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifySignature } from "@/utils/verifySignatureWebhook";
import { eventQueue } from "@/lib/queue";
import { useAuthStore } from "@/store/authStore";
import useGetDynamicUser from "@/hooks/use-get-dynamic-user";
import { setUserIdFromData } from "@/utils/setUserId";

const DYNAMIC_SECRET = process.env.DYNAMIC_SECRET!;

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-dynamic-signature-256");
  const payload = await req.text();

  if (!signature) {
    console.error("Missing signature");
    return NextResponse.json({ message: "Missing signature" }, { status: 400 });
  }

  const isValid = verifySignature({
    secret: DYNAMIC_SECRET,
    signature,
    payload,
  });

  if (!isValid) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(payload);
  const { eventName, data } = body;

  console.log("Received event:", eventName);
  console.log("Data:", data);

  // Set user ID in Zustand store
  setUserIdFromData(data);

  // Add the event to the queue
  eventQueue.enqueue({ eventName, data });

  // Immediately return a 200 response
  return NextResponse.json(
    { message: "Event queued for processing" },
    { status: 200 }
  );
}
