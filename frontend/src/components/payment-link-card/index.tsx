"use client";

import ClaimForm from "@/components/forms/claim-form";
import LinkForm from "@/components/forms/link-form";
import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PaymentLinkContent() {
  const [activeButton, setActiveButton] = useState("send");
  const [claimId, setClaimId] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const linkParam = searchParams.get("link");
    if (linkParam) {
      setActiveButton("receive");
      setClaimId(linkParam);
    }
  }, [searchParams]);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <>
      <div className="flex w-full mx-auto mb-2 gap-2 flex-wrap uppercase">
        <Button
          size="sm"
          variant="paez"
          className={activeButton === "send" ? "active" : ""}
          onClick={() => handleButtonClick("send")}
        >
          Send
        </Button>
        <Button
          size="sm"
          variant="paez"
          className={activeButton === "receive" ? "active" : ""}
          onClick={() => handleButtonClick("receive")}
        >
          Receive
        </Button>
      </div>
      {activeButton === "send" && <LinkForm />}
      {activeButton === "receive" && <ClaimForm claimId={claimId} />}
    </>
  );
}

export default function PaymentLink() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentLinkContent />
    </Suspense>
  );
}
