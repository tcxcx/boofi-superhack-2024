import { useState, useCallback } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthersExtension } from "@dynamic-labs/ethers-v5";
// use ethersExtension and DynamicContextProvider  if this doesn't work since it's probable dynamic is not ethers v5 compatible by default

const useCreateAttestation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attestationUID, setAttestationUID] = useState<string | null>(null);

  const { primaryWallet } = useDynamicContext();

  const createAttestation = useCallback(async () => {
    if (!primaryWallet) {
      setError("Wallet not connected");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get the signer from Dynamic
      const signer = await primaryWallet?.connector.ethers?.getSigner();

      if (!signer) {
        throw new Error("Signer not available");
      }

      // 1. Fetch data from the API
      const response = await fetch("/api/eas/create-attestation");
      if (!response.ok) throw new Error("Failed to fetch attestation data");

      const attestationData = await response.json();
      const eas = new EAS(attestationData.easContractAddress);

      // Use the Dynamic wallet's provider to connect EAS
      const provider = await primaryWallet.connector.getPublicClient();
      if (!provider) throw new Error("Failed to get provider");

      await eas.connect(signer);

      // Get the signer's address
      const address = await signer.getAddress();

      // 3. Initialize SchemaEncoder with the schema string

      const schemaEncoder = new SchemaEncoder(attestationData.schemaString);
      const encodedData = schemaEncoder.encodeData(attestationData.schemaData);

      // 4. Create the attestation
      const tx = await eas.attest({
        schema: attestationData.schemaUID,
        data: {
          recipient: attestationData.recipient,
          expirationTime: attestationData.expirationTime,
          revocable: attestationData.revocable,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();
      setAttestationUID(newAttestationUID);

      console.log("New attestation UID:", newAttestationUID);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }, [primaryWallet]);

  return { createAttestation, isLoading, error, attestationUID };
};

export default useCreateAttestation;
