import json
import requests
from datetime import datetime

def main(context):
    context.log('Executing DeFi Potential Calculation function')

    try:
        if context.req.method == 'POST':
            payload = context.req.body

            if isinstance(payload, str):
                try:
                    payload = json.loads(payload)
                except json.JSONDecodeError:
                    return context.res.json({"error": "Invalid JSON payload"}, 400)

            user_id = payload.get('userId')
            crypto_balances = payload.get('cryptoBalances', {})

            if not user_id:
                return context.res.json({"error": "userId is required"}, 400)

            context.log(f"Received user_id: {user_id}")
            context.log(f"Received crypto_balances: {json.dumps(crypto_balances, indent=2)}")

            financial_data = fetch_user_data(context, user_id)
            result = calculate_defi_potential(financial_data, crypto_balances)

            output = {
                "userId": user_id,
                **result,
                "timestamp": datetime.now().isoformat()  # Correct way to get the current timestamp
            }

            context.log(f"Output: {json.dumps(output, indent=2)}")
            return context.res.json(output)
        else:
            return context.res.json({"error": "Method not allowed"}, 405)

    except Exception as e:
        context.error(f"An error occurred: {str(e)}")
        return context.res.json({"error": "Internal server error"}, 500)

def fetch_user_data(context, user_id):
    context.log(f"Fetching data for user: {user_id}")
    api_url = f"http://boofi.xyz/api/eas/user-financial-data?userId={user_id}"
    
    try:
        response = requests.get(api_url)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        data = response.json()
        context.log(f"Fetched financial data: {json.dumps(data, indent=2)}")
        return data
    except requests.RequestException as e:
        context.error(f"Failed to fetch user data: {str(e)}")
        raise Exception(f"Failed to fetch user data: {str(e)}")

def calculate_defi_potential(financial_data, crypto_balances):
    bank_balance = financial_data.get('bankAccounts', {}).get('totalCurrentBalance', 0)
    total_crypto_balance = float(crypto_balances.get('totalBalanceUSD', 0))
    total_balance = bank_balance + total_crypto_balance

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
