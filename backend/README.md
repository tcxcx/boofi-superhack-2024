# BooFi Backend

## Project Overview

BooFi is a decentralized finance platform that integrates web3 wallet connections, personal finance tracking, and a novel credit scoring system using ZK-ML (Zero-Knowledge Machine Learning). This backend implements a Domain-Driven Design (DDD) architecture, providing a robust foundation for handling complex financial operations and user data management.

## Architecture and DDD Focus

Our backend follows Domain-Driven Design principles, separating concerns into distinct layers:

1. **Domain Layer**: Contains the core business logic and entities.
2. **Application Layer**: Orchestrates the application's use cases.
3. **Infrastructure Layer**: Handles external concerns like databases and external services.
4. **Interface Layer**: Manages the API endpoints and request handling.

## File Structure

/backend
├── src/
│ ├── domain/
│ │ ├── models/
│ │ │ ├── User.ts
│ │ │ ├── FinancialData.ts
│ │ │ ├── CreditScore.ts
│ │ │ ├── LoanRequest.ts
│ │ │ └── LoanPayment.ts
│ │ └── repositories/
│ ├── application/
│ │ └── services/
│ │ ├── UserService.ts
│ │ ├── FinancialDataService.ts
│ │ ├── CreditScoreService.ts
│ │ └── LoanService.ts
│ ├── infrastructure/
│ │ ├── database/
│ │ │ ├── connection.ts
│ │ │ └── migrations/
│ │ ├── repositories/
│ │ └── external/
│ │ ├── DynamicWebhookHandler.ts
│ │ ├── PlaidWebhookHandler.ts
│ │ ├── WorldIdChecker.ts
│ │ └── GoldskyStreamHandler.ts
│ ├── interfaces/
│ │ ├── controllers/
│ │ ├── routes/
│ │ └── webhooks/
│ ├── utils/
│ │ ├── errorHandler.ts
│ │ └── logger.ts
│ └── app.ts
├── tests/
├── Dockerfile
├── docker-compose.yml
├── knexfile.js
├── package.json
└── tsconfig.json

## Setup and Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies: `npm install`
4. Set up environment variables (see Environment Variables section)
5. Run migrations: `npm run migrate`
6. Start the server: `npm run dev`

## Docker Setup

1. Ensure Docker and Docker Compose are installed
2. Build and run the containers: `docker-compose up --build`

## Environment Variables

Create a `.env` file in the root of the backend directory as per the .env.example file.

## Database Migrations

We use Knex.js for database migrations. Important commands:

- Create a new migration: `npm run migrate:make migration_name`
- Run migrations: `npm run migrate`
- Rollback last migration: `npm run migrate:rollback`

## Integrations

### Dynamic

Dynamic provides web3 wallet connections. We use their webhooks to keep user wallet information up-to-date in the database.

### Plaid

Plaid is used for connecting traditional bank accounts. We implement Plaid's webhooks to receive real-time updates on financial data in the database.

### World ID

World ID is used for proof of personhood. We implement a verification endpoint that communicates with World ID's API on new user registration.

### Goldsky

Goldsky is used for real-time crypto data streaming. We implement a service to handle this data stream and update user financial information accordingly based on the user wallet's address and multichain data streamed to a mirror postgresql database instance.

## User Object

Our User object combines information from Dynamic, Plaid, and World ID:

```typescript
interface User {
  id: string;
  email: string;
  walletAddress: string;
  worldIdVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```
