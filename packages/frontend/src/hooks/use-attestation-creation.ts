import { useState, useCallback } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { BrowserProvider, Eip1193Provider, JsonRpcSigner } from "ethers";
import { EthersExtension } from "@dynamic-labs/ethers-v5";

export const useCreateAttestation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attestationUID, setAttestationUID] = useState<string | null>(null);

  const { primaryWallet, network } = useDynamicContext();

  const createAttestation = useCallback(async () => {
    if (!primaryWallet) {
      setError("Wallet not connected");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let signer: JsonRpcSigner | undefined;

      // Try to get signer using different methods
      if (primaryWallet.connector.ethers) {
        signer = await primaryWallet.connector.ethers.getSigner();
      } else if (primaryWallet.connector.getWeb3Provider) {
        const web3Provider = await primaryWallet.connector.getWeb3Provider();
        const provider = new BrowserProvider(web3Provider as Eip1193Provider);
        signer = await provider.getSigner();
      } else if (window.ethereum) {
        const provider = new BrowserProvider(
          window.ethereum as Eip1193Provider
        );
        signer = await provider.getSigner();
      }

      if (!signer) {
        throw new Error("Failed to get signer");
      }

      // 1. Fetch data from the API
      const response = await fetch("/api/eas/create-attestation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          /* Add any necessary data here */
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch attestation data");

      const attestationData = await response.json();
      const eas = new EAS(attestationData.easContractAddress);

      // Connect EAS to the signer
      eas.connect(signer);

      // Get the signer's address
      const address = await signer.getAddress();

      // 3. Initialize SchemaEncoder with the schema string
      const schemaEncoder = new SchemaEncoder(attestationData.schemaString);
      const encodedData = schemaEncoder.encodeData(attestationData.schemaData);

      // 4. Create the attestation
      const tx = await eas.attest({
        schema: attestationData.schemaUID,
        data: {
          recipient: address,
          expirationTime: attestationData.expirationTime,
          revocable: attestationData.revocable,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();

      const attestationUrl = `https://base-sepolia.easscan.org/attestation/view/${newAttestationUID}`;
      setAttestationUID(newAttestationUID);

      console.log("New attestation UID:", newAttestationUID);
      console.log("Attestation URL:", attestationUrl);
      return {
        attestationUID: newAttestationUID.toString(), // Convert to string
        attestationUrl,
      };
    } catch (err) {
      console.error("Attestation error:", err);
      if (err instanceof Error) {
        if (err.message.includes("insufficient funds")) {
          setError(
            "Insufficient funds. Please add more tokens to your wallet and try again."
          );
        } else {
          setError(err.message);
        }
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }, [primaryWallet, network]);

  return { createAttestation, isLoading, error, attestationUID };
};
