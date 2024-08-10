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

## Next Steps

To enhance the DeFi Potential Index Algorithm and provide more accurate and comprehensive assessments, we plan to implement the following improvements:

1. **Granular Scoring System**: Implement a more nuanced scoring scale (e.g., 300-850) for finer differentiation between users.

2. **Asset Composition Analysis**: Factor in the ratio of crypto to fiat assets, potentially weighting more stable assets higher.

3. **Historical Data Integration**: Incorporate historical financial behavior data, such as past loan repayment history and balance consistency over time.

4. **Crypto Volatility Factor**: Adjust the contribution of crypto assets to the total balance based on recent price volatility.

5. **Debt Consideration**: Factor in known debts or other DeFi loans to provide a more complete financial picture.

6. **Income Assessment**: Implement a debt-to-income ratio if income data becomes available.

7. **Dynamic Thresholds**: Adjust scoring thresholds based on overall market conditions or average user balances.

8. **Multi-Factor Scoring Model**: Develop a more comprehensive model that considers various aspects of the user's financial profile beyond total balance.

9. **Crypto Portfolio Diversity**: Assess the diversity of crypto assets to potentially indicate lower risk profiles.

10. **User Engagement Metrics**: Include factors like account age or transaction frequency to gauge user experience with DeFi platforms.

11. **Regulatory Compliance**: Ensure all enhancements comply with relevant financial regulations and data protection laws.

12. **Transparency Improvements**: Develop clear explanations for users about how their score is calculated and what it means.

13. **Machine Learning Integration**: Explore the potential for using machine learning models to improve prediction accuracy over time.

14. **Real-time Updates**: Implement a system for more frequent or real-time updates to the DeFi Potential Score as user's financial situations change.
