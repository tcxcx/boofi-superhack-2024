from appwrite.client import Client
import json

def main(context):
    client = (
        Client()
        .set_endpoint('https://cloud.appwrite.io/v1')
        .set_project(context.env['APPWRITE_FUNCTION_PROJECT_ID'])
        .set_key(context.env['APPWRITE_API_KEY'])
    )

    # Log the function invocation
    context.log('Executing DeFi Potential Calculation function')

    try:
        # Access the request data
        if context.req.method == 'POST':
            # The payload should already be a dictionary
            payload = context.req.body

            # If payload is a string, try to parse it as JSON
            if isinstance(payload, str):
                try:
                    payload = json.loads(payload)
                except json.JSONDecodeError:
                    return context.res.json({"error": "Invalid JSON payload"}, 400)

            # Extract data from payload
            user_id = payload.get('userId')
            crypto_balances = payload.get('cryptoBalances', {})

            if not user_id:
                return context.res.json({"error": "userId is required"}, 400)

            context.log(f"Received user_id: {user_id}")
            context.log(f"Received crypto_balances: {crypto_balances}")

            # Fetch user financial data (simulated for now)
            financial_data = fetch_user_data(context, user_id)

            # Calculate DeFi potential
            result = calculate_defi_potential(financial_data, crypto_balances)

            # Prepare and send the response
            output = {
                "userId": user_id,
                **result,
                "timestamp": context.req.time
            }

            context.log(f"Output: {output}")
            return context.res.json(output)
        else:
            return context.res.json({"error": "Method not allowed"}, 405)

    except Exception as e:
        context.error(f"An error occurred: {str(e)}")
        return context.res.json({"error": "Internal server error"}, 500)

def fetch_user_data(context, user_id):
    # Simulated data fetch - replace with actual database query
    context.log(f"Fetching data for user: {user_id}")
    return {
        "bankAccounts": {
            "totalCurrentBalance": 50000  # Example balance
        }
    }

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