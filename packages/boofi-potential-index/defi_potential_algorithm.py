#!/usr/bin/env python
# coding: utf-8
import sys
import json
import requests
from datetime import datetime

def fetch_user_data(user_id):
    api_url = f"http://localhost:3000/api/eas/user-financial-data?userId={user_id}"
    response = requests.get(api_url)
    if response.status_code == 200:
        data = response.json()
        print(f"Fetched financial data: {data}", file=sys.stderr)  # Debug print
        return data
    else:
        raise Exception(f"Failed to fetch user data: {response.status_code}")

def calculate_defi_potential(financial_data, crypto_balances):
    print(f"Financial data: {financial_data}", file=sys.stderr)  # Debug print
    print(f"Crypto balances: {crypto_balances}", file=sys.stderr)  # Debug print

    bank_balance = financial_data['bankAccounts'].get('totalCurrentBalance', 0)
    total_crypto_balance = float(crypto_balances.get('totalBalanceUSD', 0))
    total_balance = bank_balance + total_crypto_balance

    # Credit score calculation
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

    rationale = f"Based on a total balance of ${total_balance:.2f} (Bank: ${bank_balance:.2f}, Crypto: ${total_crypto_balance:.2f})"

    return {
        "defiPotentialScore": score,
        "maxLoanAmount": max_loan,
        "rationale": rationale,
        'totalAttested': total_balance,
    }

if __name__ == "__main__":
    user_id = sys.argv[1]
    crypto_balances_str = sys.argv[2] if len(sys.argv) > 2 else '{}'
    
    print(f"Received user_id: {user_id}", file=sys.stderr)
    print(f"Received crypto_balances: {crypto_balances_str}", file=sys.stderr)
    
    try:
        crypto_balances = json.loads(crypto_balances_str)
    except json.JSONDecodeError:
        print(f"Error decoding JSON: {crypto_balances_str}", file=sys.stderr)
        crypto_balances = {"totalBalanceUSD": 0}
    
    financial_data = fetch_user_data(user_id)
    result = calculate_defi_potential(financial_data, crypto_balances)
    
    output = {
        "userId": user_id,
        **result,
        "timestamp": datetime.now().isoformat()
    }
    
    print(json.dumps(output))