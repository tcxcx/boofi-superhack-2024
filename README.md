# **BooFi | Spooky Crypto-Finance Made Easy**

![BooFi Banner](media/opengraph-image.png)

## **Project Overview**

BooFi is a user-friendly, decentralized financial inclusion platform designed to make crypto-finance accessible for everyone, especially in emerging markets. Our friendly ghost, BooFi, guides users through savings, payments, remittances, loans, and DeFi, ensuring financial empowerment and inclusion. We aim to democratize access to essential financial services by leveraging blockchain technology and advanced algorithms within a secure, transparent, and efficient ecosystem. BooFi is meant to become a 'Notion of Web3 & Fintech', where everyone can access financial services, regardless of their location or financial background, tracking their personal finances effortlessly with a user-friendly interface and preserving privacy.

### **Key Features:**

- **Peanut Protocol Integration:** For secure and efficient link payments.
- **Minipay Support:** Tailored for Celo, facilitating micro-payments through Minipay link payments.
- **Blockscout Integration:** Users can view their transaction history via Blockscout, enhancing transparency and trust.
- **WorldId Sign-In:** Our integration with NextAuth ensures secure, session-based authentication, leveraging WorldId for identity verification.
- **Base Payments Tracking:** Comprehensive tracking and display of user transactions across the Base blockchain.
- **Credit Scoring Engine EAS Integration:** A Python-based algorithm processes financial data to generate a credit score, enabling users to access micro-loans based on their creditworthiness. The output is formatted according to the Ethereum Attestation Service (EAS) schema, enabling seamless integration and attestation creation within the BooFi ecosystem.
- **Goldsky Blockchain Indexing:** Goldsky indexes blockchain data, providing a comprehensive view of user activities.

## **Technical Architecture**

### **Core Technologies**

- **Frontend:** Built with Next.js 14 app router and server actions, BooFi offers a responsive and dynamic user experience, integrating various financial and blockchain services into a cohesive platform.
- **Backend:** We employ an Appwrite instance as our database, ensuring secure and scalable data management.
  Here’s an enhanced version of your README section with relevant repository links included as proofs for each point:

---

- **Blockchain Integration:** Optimism, Celo, and Base are the primary blockchains used, with Worldcoin ID for identity verification and Dynamic for multichain wallet capabilities. We also integrate with the Peanut protocol smart contracts for secure and efficient link payments with multi-chain support. While Celo is the primary chain for payments, we also support Minipay for Celo micro-payments. We run a mirror pipeline for Base and Optimism blockchain transactions, which seamlessly syncs with our PostgreSQL database. This data pipeline is critical for our user dashboard, where users can view a comprehensive summary of all transactions associated with their wallets. This feature provides transparency and enables users to track their financial history effortlessly and provides a secure and efficient way to manage transactions for both banking and cryptocurrency accounts. At the same time, we leverage this information to also use the Ethereum Attestation Service (EAS) to generate and verify attestations related to user financial states and identities.

  - [Worldcoin ID Integration](https://github.com/tcxcx/boofi-superhack-2024/blob/main/packages/frontend/src/app/api/worldid/sybil-attestation/route.ts)
  - [Peanut Protocol Smart Contracts](https://github.com/tcxcx/boofi-superhack-2024/blob/main/packages/frontend/src/hooks/use-peanut.ts)
  - [Minipay for Celo Link Micro-Payments](https://github.com/tcxcx/boofi-superhack-2024/blob/main/packages/frontend/src/hooks/use-minipay-links.ts)
  - [Ethereum Attestation Service (EAS) Integration](https://github.com/tcxcx/boofi-superhack-2024/blob/main/packages/frontend/src/hooks/use-attestation-creation.ts)
  - [Dynamic Multichain Wallet Integration](https://github.com/tcxcx/boofi-superhack-2024/blob/main/packages/frontend/src/lib/providers.tsx)

### **Mirror Pipeline for Transaction Tracking**

BooFi features a sophisticated mirror pipeline for Base and Optimism blockchain transactions, which seamlessly syncs with our PostgreSQL database. This data pipeline is critical for our user dashboard, where users can view a comprehensive summary of all transactions associated with their wallets. This feature provides transparency and enables users to track their financial history effortlessly. Plaid is used for gathering financial data, while Goldsky indexes blockchain data, providing a comprehensive view of user activities.

- [Mirror Pipeline for Base and Optimism on NeonDB](https://github.com/tcxcx/boofi-superhack-2024/blob/main/packages/frontend/src/app/api/neon-goldsky-db/appwrite-neon-webhook/route.ts)
- [Goldsky Blockchain Indexing](https://github.com/tcxcx/boofi-superhack-2024/blob/main/packages/transaction-mirror-pipeline/superhack-boofi-transactions-v2.yaml)

- **Attestation Service:** Ethereum Attestation Service (EAS) is used for generating and verifying attestations related to user financial states and identities.

  - [EAS Attestation Service Code](https://github.com/tcxcx/boofi-superhack-2024/blob/main/packages/frontend/src/app/api/eas/create-attestation/route.ts)
  - [ML Model for Credit Scoring pipeline connected to EAS](https://github.com/tcxcx/boofi-superhack-2024/blob/main/packages/boofi-potential-index/defi_potential_algorithm.py)

## **Credit Scoring Engine**

The credit scoring engine is a vital component of BooFi, designed to process user financial data from both banking and cryptocurrency accounts. Here's how it works:

1. **Data Fetching:** The engine connects to our Next.js 14 app via API to fetch financial data from Plaid (for banking data) and relevant crypto accounts.
2. **Scoring Algorithm:** Using a Python-based algorithm implemented in a Conda environment, it processes this data to generate a credit score. The score is accompanied by a rationale, offering insights into the user's financial standing and determining the maximum loan amount they can access on our platform.
3. **EAS Integration:** The output is formatted according to the Ethereum Attestation Service (EAS) schema, enabling seamless integration and attestation creation within the BooFi ecosystem.

## **Additional Features**

1. **Peanut Protocol Integration:** For secure and efficient link payments.
2. **Minipay Support:** Tailored for Celo, facilitating micro-payments through Minipay link payments.
3. **Blockscout Integration:** Users can view their transaction history via Blockscout, enhancing transparency and trust.
4. **WorldId Sign-In:** Our integration with NextAuth ensures secure, session-based authentication, leveraging WorldId for identity verification.
5. **Payments Transaction Tracking:** Comprehensive tracking and display of user transactions across the Base blockchain.
6. **Dynamic Multichain Wallet Integration:** Dynamic is a multichain wallet that supports multiple blockchains, including Celo, Optimism, and Base. It allows users to manage their cryptocurrency accounts across different chains, providing a seamless experience for their financial transactions.

## **How to Run**

To get started with BooFi, follow these steps:

### **Installation:**

1. **Clone the Repository:**

   ```bash
   git clone git@github.com:tcxcx/boofi-superhack-2024.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd packages/frontend
   ```

3. **Install Dependencies:**

   ```bash
   yarn
   ```

4. **Set Up Environment Variables:**
   - Create a `.env` file based on `.env.example`.
   - Add your API keys and necessary configuration, including `NEXT_PUBLIC_DEEZ_NUTS_API_KEY` from Peanut Protocol [here](https://peanut.to/).

### **Running the Application:**

1. **Start the Development Server:**

   ```bash
   yarn dev
   ```

2. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000`.

3. **Set up Webhooks:**
   Dynamic and Appwrite webhook services.

4. **Explore BooFi:**
   - Sign in using WorldId for a secure session.
   - Connect your dynamic wallet to BooFi for crypto transactions.
   - Connect your bank account to BooFi for bank transactions using Plaid.
   - Get a personalized dashboard with your financial data. Manage your bank accounts, crypto wallets, and transactions.
   - Access your credit score and financial attestation and upload it to EAS, powered by our Python-based credit scoring engine.
   - View your transaction history on the dashboard, powered by our mirror pipeline for Base and Optimism.
   - Use the financial tools to create payment links, track expenses, and apply for micro-loans.

## **Contribution Guidelines**

We welcome contributions to enhance BooFi's features and capabilities. Here’s how you can contribute:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Commit your changes with clear messages.
4. Push your branch and open a Pull Request.

## **License**

BooFi is licensed under the MIT License. Please see the [LICENSE](LICENSE) file for more information.

## **Contact Information**

For any inquiries or support, reach out to us:

- **Twitter:** [@criptopoeta](https://twitter.com/criptopoeta)
