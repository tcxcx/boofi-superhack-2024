# DeFi Potential Index Algorithm

## Overview

The DeFi Potential Index Algorithm is a tool designed to assess a user's potential for participating in Decentralized Finance (DeFi) activities. It analyzes a user's financial data, including bank balances and cryptocurrency holdings, to generate a score that indicates their DeFi participation potential.

## Features

- Fetches user financial data from a Next.js API endpoint with a user ID
- Calculates a DeFi Potential Score based on total balance
- Determines a maximum participation amount for DeFi activities
- Formats the results for use with Ethereum Attestation Service (EAS)

## Requirements

- Python 3.7+
- Conda environment
- Required Conda packages (see `environment.yml`)

## Algorithm Details

The algorithm performs the following steps:

1. Fetches user financial data from the Next.js API.
2. Calculates the total balance by combining bank and crypto holdings.
3. Assigns a DeFi Potential Score based on the total balance:

- 800 for balances over $100,000
- 700 for balances over $50,000
- 600 for balances over $10,000
- 500 for balances under $10,000

4. Calculates a maximum participation amount as a percentage of the total balance.
5. Formats the results for EAS attestation.
