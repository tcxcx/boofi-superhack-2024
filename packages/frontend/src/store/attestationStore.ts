// attestationStore.ts
import { create } from "zustand";

interface AttestationState {
  open: boolean;
  currentStep: number;
  isConsentChecked: boolean;
  isVerified: boolean;
  isLoading: boolean;
  creditScore: number | null;
  attestationUrl: string | null;
  errorMessage: string | null;
  isWorldIdVerifying: boolean;
  setOpen: (open: boolean) => void;
  setCurrentStep: (step: number) => void;
  setIsConsentChecked: (checked: boolean) => void;
  setIsVerified: (verified: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setCreditScore: (score: number | null) => void;
  setAttestationUrl: (url: string | null) => void;
  setErrorMessage: (message: string | null) => void;
  setIsWorldIdVerifying: (verifying: boolean) => void;
  reset: () => void;
}

export const useAttestationStore = create<AttestationState>((set) => ({
  open: false,
  currentStep: 1,
  isConsentChecked: false,
  isVerified: false,
  isLoading: false,
  creditScore: null,
  attestationUrl: null,
  errorMessage: null,
  isWorldIdVerifying: false,
  setOpen: (open: boolean) => set({ open }),
  setCurrentStep: (step: number) => set({ currentStep: step }),
  setIsConsentChecked: (checked: boolean) => set({ isConsentChecked: checked }),
  setIsVerified: (verified: boolean) => set({ isVerified: verified }),
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  setCreditScore: (score: number | null) => set({ creditScore: score }),
  setAttestationUrl: (url: string | null) => set({ attestationUrl: url }),
  setErrorMessage: (message: string | null) => set({ errorMessage: message }),
  setIsWorldIdVerifying: (verifying: boolean) =>
    set({ isWorldIdVerifying: verifying }),
  reset: () =>
    set({
      currentStep: 1,
      isConsentChecked: false,
      isVerified: false,
      isLoading: false,
      creditScore: null,
      attestationUrl: null,
      errorMessage: null,
      isWorldIdVerifying: false,
    }),
}));
