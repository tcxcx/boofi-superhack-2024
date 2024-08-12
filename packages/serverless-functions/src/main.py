import json
from datetime import datetime

def main(context):
    try:
        # Get payload from the request
        payload = json.loads(context.req.payload)
        user_id = payload.get('userId')
        crypto_balances = payload.get('cryptoBalances', {})

        context.log(f"Received user_id: {user_id}")
        context.log(f"Received crypto_balances: {crypto_balances}")

        # Fetch user financial data
        financial_data = fetch_user_data(context, user_id)

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

def fetch_user_data(context, user_id):
    # In a real Appwrite function, you might use context.env to get environment variables
    # For now, we'll simulate fetching data
    # You would replace this with actual database querying logic
    context.log(f"Fetching data for user: {user_id}")
    # Simulated data - replace with actual data fetching logic
    return {
        "bankAccounts": {
            "totalCurrentBalance": 50000  # Example balance
        }
    }

def calculate_defi_potential(financial_data, crypto_balances):
    context.log(f"Financial data: {financial_data}")
    context.log(f"Crypto balances: {crypto_balances}")

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