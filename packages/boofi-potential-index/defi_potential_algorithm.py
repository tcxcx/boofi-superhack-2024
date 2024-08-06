#!/usr/bin/env python
# coding: utf-8

import sys
import json
import pandas as pd
import numpy as np
import requests

# Function to fetch user financial data from Next.js API
def fetch_user_data(user_id):
    api_url = f"http://localhost:3000/api/eas/user-financial-data?userId={user_id}"
    response = requests.get(api_url)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to fetch user data: {response.status_code}")

# Function to calculate credit score
def calculate_defi_potential(financial_data):
    # Extract relevant data
    bank_balance = financial_data['bankAccounts']['totalCurrentBalance']
    total_balance = bank_balance

    # Simple scoring algorithm (customize as needed)
    if total_balance > 100000:
        score = 800
        max_loan = total_balance * 0.5
    elif total_balance > 50000:
        score = 700
        max_loan = total_balance * 0.4
    elif total_balance > 10000:
        score = 600
        max_loan = total_balance * 0.3
    else:
        score = 500
        max_loan = total_balance * 0.2

    return {
        'credit_score': score,
        'max_loan_amount': max_loan,
        'rationale': f"Based on total balance of ${total_balance:.2f}"
    }

# Function to format data for EAS schema
def format_for_eas(user_id, credit_data):
    return {
        'userId': user_id,
        'defiPotentialScore': credit_data['credit_score'],
        'maxLoanAmount': credit_data['max_loan_amount'],
        'rationale': credit_data['rationale'],
        'timestamp': pd.Timestamp.now().isoformat()
    }

# Main execution
if __name__ == "__main__":
    user_id = sys.argv[1]  # Get user_id from command-line arguments
    financial_data = fetch_user_data(user_id)
    credit_data = calculate_defi_potential(financial_data)
    eas_data = format_for_eas(user_id, credit_data)

    # Output the final JSON data
    print(json.dumps(eas_data))
