import { UserProfile as DynamicUserProfile } from "@dynamic-labs/sdk-react-core";

export interface ExtendedUserProfile extends DynamicUserProfile {
  worldIdVerified?: boolean;
  plaidConnected?: boolean;
  kycVerificationNeeded?: boolean;
}

export interface ExtendedUserProfileWithSetProperties
  extends ExtendedUserProfile {
  setProperties: (props: Record<string, any>) => Promise<void>;
}

export type UserOnboardingFieldRequest = {
  key: string;
  required: boolean;
  isCustom: boolean;
  label?: string;
};
