import os
import json
import requests
from datetime import datetime

def fetch_user_data(user_id):
    api_url = f"http://boofi.xyz/api/eas/user-financial-data?userId={user_id}"
    response = requests.get(api_url)
    if response.status_code == 200:
        data = response.json()
        print(f"Fetched financial data: {data}")  # Debug print
        return data
    else:
        raise Exception(f"Failed to fetch user data: {response.status_code}")

def calculate_defi_potential(financial_data, crypto_balances):
    print(f"Financial data: {financial_data}") 
    print(f"Crypto balances: {crypto_balances}")  # Debug print

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

def main(context):
    try:
        # Access the raw request body and decode it
        raw_body = context.req.get('body', '').decode('utf-8')
        payload = json.loads(raw_body)
        user_id = payload.get('userId')
        crypto_balances_str = payload.get('cryptoBalances', '{}')

        context.log(f"Received user_id: {user_id}")
        context.log(f"Received crypto_balances: {crypto_balances_str}")

        crypto_balances = json.loads(crypto_balances_str)

        financial_data = fetch_user_data(user_id)
        result = calculate_defi_potential(financial_data, crypto_balances)
        output = {
            "userId": user_id,
            **result,
            "timestamp": datetime.now().isoformat()
        }
        context.log(f"Output: {output}")
        return context.res.json(output)
    except json.JSONDecodeError as e:
        context.error(f"Error decoding JSON: {e}")
        return context.res.json({"error": "Invalid JSON payload"}, 400)
    except Exception as e:
        context.error(f"An error occurred: {str(e)}")
        return context.res.json({"error": str(e)}, 500)
