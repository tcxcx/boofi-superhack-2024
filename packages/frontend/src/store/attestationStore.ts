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

  easGrade: string | null;
  totalAttested: string | null;
  maxLoanAmount: string | null;
  setEasGrade: (grade: string | null) => void;
  setTotalAttested: (total: string | null) => void;
  setMaxLoanAmount: (amount: string | null) => void;
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
  easGrade: null,
  totalAttested: null,
  maxLoanAmount: null,
  setEasGrade: (grade: string | null) => set({ easGrade: grade }),
  setTotalAttested: (total: string | null) => set({ totalAttested: total }),
  setMaxLoanAmount: (amount: string | null) => set({ maxLoanAmount: amount }),
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
      easGrade: null,
      totalAttested: null,
      maxLoanAmount: null,
    }),
}));
