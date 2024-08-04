import { create } from "zustand";

interface AuthState {
  userId: string | null;
  isDialogOpen: boolean;
  isDialogVisible: boolean;
  isWorldIdVerifying: boolean;
  isPlaidVerifying: boolean;
  isPlaidPortalOpen: boolean;
  isPlaidLoading: boolean;
  isVerified: boolean;
  setUserId: (userId: string) => void;
  setDialogOpen: (isOpen: boolean) => void;
  setDialogVisible: (isVisible: boolean) => void;
  setWorldIdVerifying: (isVerifying: boolean) => void;
  setPlaidVerifying: (isVerifying: boolean) => void;
  setPlaidPortalOpen: (isOpen: boolean) => void;
  setPlaidLoading: (isLoading: boolean) => void;
  setVerified: (isVerified: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  isDialogOpen: false,
  isDialogVisible: true,
  isWorldIdVerifying: false,
  isPlaidVerifying: false,
  isPlaidPortalOpen: false,
  isPlaidLoading: false,
  isVerified: false,
  setUserId: (userId: string) => set({ userId }),
  setDialogOpen: (isOpen: boolean) => set({ isDialogOpen: isOpen }),
  setDialogVisible: (isVisible: boolean) => set({ isDialogVisible: isVisible }),
  setWorldIdVerifying: (isVerifying: boolean) =>
    set({ isWorldIdVerifying: isVerifying }),
  setPlaidVerifying: (isVerifying: boolean) =>
    set({ isPlaidVerifying: isVerifying }),
  setPlaidPortalOpen: (isOpen: boolean) => set({ isPlaidPortalOpen: isOpen }),
  setPlaidLoading: (isLoading: boolean) => set({ isPlaidLoading: isLoading }),
  setVerified: (isVerified: boolean) => set({ isVerified }),
}));
