/* eslint-disable no-unused-vars */

import { decl } from "postcss";
import { interfaces as peanutInterfaces } from "@squirrel-labs/peanut-sdk";

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare type SignUpParams = {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  password: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare type User = {
  ens: any;
  id: string;
  $id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dwollaCustomerUrl: string;
  dwollaCustomerId: string;
  worldIdVerified: boolean;
};

declare type NewUserParams = {
  userId: string;
  email: string;
  name: string;
  password: string;
};

declare type Account = {
  id: string;
  availableBalance: number;
  currentBalance: number;
  officialName: string;
  mask: string;
  institutionId: string;
  name: string;
  type: string;
  subtype: string;
  appwriteItemId: string;
  shareableId: string;
};

declare type ChainBalances = {
  [key: string]: {
    chainName: string;
    tokens: any[];
    totalUSD: number;
  };
};

declare type Transaction = {
  id: string;
  $id: string;
  name: string;
  paymentChannel: string;
  type: string;
  accountId: string;
  amount: number;
  pending: boolean;
  category: string;
  date: string;
  image: string;
  type: string;
  $createdAt: string;
  channel: string;
  senderBankId: string;
  receiverBankId: string;
};
declare type TokenBalance = {
  networkId: number;
  marketValue: number;
};

declare type ChainBalances = {
  [key: string]: {
    chainName: string;
    tokens: TokenBalance[];
    totalUSD: number;
  };
};

declare type CryptoBalances = {
  chainBalances: ChainBalances;
  totalBalanceUSD: number;
};

declare type Bank = {
  $id: string;
  accountId: string;
  bankId: string;
  accessToken: string;
  fundingSourceUrl: string;
  userId: string;
  shareableId: string;
};

declare type AccountTypes =
  | "depository"
  | "credit"
  | "loan "
  | "investment"
  | "other";

declare type Category = "Food and Drink" | "Travel" | "Transfer";

declare type CategoryCount = {
  name: string;
  count: number;
  totalCount: number;
};

declare type Receiver = {
  firstName: string;
  lastName: string;
};

declare type TransferParams = {
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
  amount: string;
};

declare type AddFundingSourceParams = {
  dwollaCustomerId: string;
  processorToken: string;
  bankName: string;
};

declare type NewDwollaCustomerParams = {
  firstName: string;
  lastName: string;
  email: string;
  type: "personal" | "business";
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn?: string;
};

declare interface CreditCardProps {
  account: Account;
  userName: string;
  showBalance?: boolean;
}

declare interface BankInfoProps {
  account: Account;
  appwriteItemId?: string;
  type: "full" | "card";
}

declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
}

declare interface MobileNavProps {
  user: User;
}

declare interface PageHeaderProps {
  topTitle: string;
  bottomTitle: string;
  topDescription: string;
  bottomDescription: string;
  connectBank?: boolean;
}

declare interface PaginationProps {
  page: number;
  totalPages: number;
}

declare interface PlaidLinkProps {
  user: User;
  variant?: "primary" | "ghost" | "outline";
  dwollaCustomerId?: string;
}

// declare type User = sdk.Models.Document & {
//   accountId: string;
//   email: string;
//   name: string;
//   items: string[];
//   accessToken: string;
//   image: string;
// };

declare interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

declare interface BankDropdownProps {
  accounts: Account[];
  setValue?: UseFormSetValue<any>;
  otherStyles?: string;
}

declare interface BankTabItemProps {
  account: Account;
  appwriteItemId?: string;
}

declare interface TotalBalanceBoxProps {
  accounts: Account[];
  totalBanks: number;
  totalCurrentBalance: number;
  chainBalances: ChainBalances;
  totalBalanceUSD: number;
}

declare interface FooterProps {
  user: User;
  type?: "mobile" | "desktop";
}

declare interface RightSidebarProps {
  user: User;
  transactions: Transaction[];
  banks: Bank[] & Account[];
}

declare interface SiderbarProps {
  user: User;
}

declare interface RecentTransactionsProps {
  accounts: Account[];
  transactions: Transaction[];
  appwriteItemId: string;
  page: number;
  userId: string;
}

declare interface TransactionHistoryTableProps {
  transactions: Transaction[];
  page: number;
}

declare interface CategoryBadgeProps {
  category: string;
}

declare interface TransactionTableProps {
  transactions: Transaction[];
}

declare interface CategoryProps {
  category: CategoryCount;
}

declare interface DoughnutChartProps {
  accounts: Account[];
  chainBalances: ChainBalances;
}

declare interface PaymentTransferFormProps {
  accounts: Account[];
}

// Actions
declare interface getAccountsProps {
  userId: string;
}

declare interface getAccountProps {
  appwriteItemId: string;
}

declare interface getInstitutionProps {
  institutionId: string;
}

declare interface getTransactionsProps {
  accessToken: string;
}

declare interface CreateFundingSourceOptions {
  customerId: string; // Dwolla Customer ID
  fundingSourceName: string; // Dwolla Funding Source Name
  plaidToken: string; // Plaid Account Processor Token
  _links: object; // Dwolla On Demand Authorization Link
}

declare interface CreateTransactionProps {
  name: string;
  amount: string;
  senderId: string;
  senderBankId: string;
  receiverId: string;
  receiverBankId: string;
  email: string;
}

declare interface getTransactionsByBankIdProps {
  bankId: string;
}

declare interface signInProps {
  email: string;
  password: string;
}

declare interface getUserInfoProps {
  userId: string;
}

declare interface exchangePublicTokenProps {
  publicToken: string;
  user: User;
}

declare interface createBankAccountProps {
  accessToken: string;
  userId: string;
  accountId: string;
  bankId: string;
  fundingSourceUrl: string;
  shareableId: string;
}

declare interface getBanksProps {
  userId: string;
}

declare interface getBankProps {
  documentId: string;
}

declare interface getBankByAccountIdProps {
  accountId: string;
}

declare interface DynamicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  firstVisit: string;
  lastVisit: string;
  newUser: boolean;
  verifiedCredentials: VerifiedCredential[];
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
}

declare interface VerifiedCredential {
  id: string;
  address?: string;
  chain?: string;
  format: string;
  publicIdentifier: string;
  lastSelectedAt?: string;
  walletName?: string;
  walletProvider?: string;
  oauthProvider?: string;
  oauthUsername?: string;
  oauthDisplayName?: string;
  oauthAccountId?: string;
  walletProperties?: Record<string, any>;
}

declare interface PaymentInfo {
  link: string;
  chainId: number;
  depositIndex: number;
  contractVersion: string;
  password: string;
  senderAddress: string;
  tokenType: string;
  tokenAddress: string;
  tokenDecimals: number;
  tokenSymbol: string;
  tokenName: string;
  tokenAmount: string;
  tokenId: number;
  claimed: boolean;
  depositDate: string;
  tokenURI: string;
  transactionHash: string;
}
// my supported chains in the whole app
export type ChainId =
  | 1
  | 11155111
  | 10
  | 11155420
  | 42220
  | 8453
  | 84532
  | 34443
  | 919
  | undefined;

// the claim type to render multichain or singlechain options on the claim page
export type ClaimType = "claim" | "claimxchain";

declare interface IClaimScreenProps {
  crossChainDetails?:
    | Array<
        peanutInterfaces.ISquidChain & {
          tokens: peanutInterfaces.ISquidToken[];
        }
      >
    | undefined;
  type: ClaimType;
  setClaimType: (type: ClaimType) => void;
  recipient: { name?: string; address: string };
  setRecipient: (recipient: { name?: string; address: string }) => void;
  selectedRoute: any;
  setSelectedRoute: (route: any) => void;
  hasFetchedRoute: boolean;
  setHasFetchedRoute: (fetched: boolean) => void;
  recipientType: interfaces.RecipientType;
  setRecipientType: (type: interfaces.RecipientType) => void;
}

declare interface xchainDetail {
  axelarChainName?: string;
  chainIconURI?: string;
  chainId?: string;
  chainType?: string;
}

type SquidChainWithTokens = peanutInterfaces.ISquidChain & {
  tokens: peanutInterfaces.ISquidToken[];
};

declare interface CombinedType extends interfaces.IPeanutChainDetails {
  tokens: interfaces.IToken[];
}
