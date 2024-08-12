from appwrite.client import Client
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
    # Initialize Appwrite client
    client = Client()
    client.set_endpoint("https://cloud.appwrite.io/v1") \
          .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"]) \
          .set_key(os.environ["APPWRITE_API_KEY"]) \
    
    try:
        # Access the raw request body
        raw_body = context.req.read().decode('utf-8')
        payload = json.loads(raw_body)
        user_id = payload.get('userId')
        crypto_balances_str = payload.get('cryptoBalances', '{}')

        print(f"Received user_id: {user_id}")
        print(f"Received crypto_balances: {crypto_balances_str}")

        crypto_balances = json.loads(crypto_balances_str)

        financial_data = fetch_user_data(user_id)
        result = calculate_defi_potential(financial_data, crypto_balances)
        output = {
            "userId": user_id,
            **result,
            "timestamp": datetime.now().isoformat()
        }
        print(f"Output: {output}")
        return context.res.json(output)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return context.res.json({"error": "Invalid JSON payload"}, 400)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return context.res.json({"error": str(e)}, 500)
