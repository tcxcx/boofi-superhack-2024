import { UserProfile as DynamicUserProfile } from "@dynamic-labs/sdk-react-core";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dwollaCustomerUrl: string;
  dwollaCustomerId: string;
  worldIdVerified: boolean;
}

export interface CombinedUserProfile extends DynamicUserProfile {
  $id: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dwollaCustomerUrl: string;
  dwollaCustomerId: string;
  worldIdVerified: boolean;
  plaidConnected?: boolean;
  kycVerificationNeeded?: boolean;
  connectedPlaidAccounts: boolean;
}

export interface CombinedUserProfileWithSetProperties
  extends CombinedUserProfile {
  setProperties: (props: Record<string, any>) => Promise<void>;
}
export type UserOnboardingFieldRequest = {
  key: string;
  required: boolean;
  isCustom: boolean;
  label?: string;
};
