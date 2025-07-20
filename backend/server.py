import os
from dotenv import load_dotenv, find_dotenv
from flask import Flask, jsonify, redirect, request
import stripe
from pathlib import Path
from flask_cors import CORS
from urllib.parse import unquote  # Add this import

load_dotenv(find_dotenv(usecwd=True))

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

app = Flask(__name__, static_url_path="", static_folder="public")
CORS(app)
domain = os.getenv("FRONTEND_URL", "http://localhost:5173")

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        # Get items and fees from request
        item_details = request.json
        items = item_details.get('items', [])
        fees = item_details.get('fees', {})
        
        # Validate that we have items
        if not items:
            return jsonify(error="No items provided"), 400
        
        # Add fees to items list
        for fee_name, fee_amount in fees.items():
            fee_item = {
                'name': fee_name.replace('_', ' ').title(),
                'description': f'{fee_name.replace("_", " ").title()} fee',
                'price': fee_amount,
                'quantity': 1,
                'is_fee': True  # Optional: flag to identify fees
            }
            items.append(fee_item)
        
        # Build line items array from combined items (now includes fees)
        line_items = []
        
        for item in items:
            product_data = {
                'name': item['name'],
            }
            if item.get('description') and item['description'].strip():
                product_data['description'] = item['description']
            
            line_items.append({
                'price_data': {
                    'currency': 'cad',
                    'product_data': product_data,
                    'unit_amount': int(item['price'] * 100),  # Convert to cents
                },
                'quantity': item.get('quantity', 1),
            })
        
        # Create the checkout session
        session = stripe.checkout.Session.create(
            ui_mode='embedded',
            line_items=line_items,
            mode='payment', 
            return_url=f"{domain}/checkout/success",
        )

        # Log the session object for debugging
        print("Checkout session created:", session)
        
       

        return jsonify(
            clientSecret=client_secret, 
            sessionId=session.id, 
            url=session.url
        )

    except Exception as e:
        print(f"Error creating checkout session: {e}")
        return jsonify(error=str(e)), 500


@app.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    try:
        # Get items and fees from request
        item_details = request.json
        items = item_details.get('items', [])
        fees = item_details.get('fees', {})
        
        # Add fees to items list
        for fee_name, fee_amount in fees.items():
            fee_item = {
                'name': fee_name.replace('_', ' ').title(),
                'description': f'{fee_name.replace("_", " ").title()}',
                'price': fee_amount,
                'quantity': 1,
                'is_fee': True  # Optional: flag to identify fees
            }
            items.append(fee_item)
        
        # Calculate total amount from combined items
        total_amount = 0
        for item in items:
            total_amount += int(item['price'] * 100) * item.get('quantity', 1)
        
        # Create a Payment Intent
        payment_intent = stripe.PaymentIntent.create(
            amount=total_amount,
            currency='cad',
            metadata={
                'items': str(items)  # Now includes fees in the items list
            }
        )
        
        # Decode client secret if needed
        client_secret = payment_intent['client_secret']
        if client_secret and '%' in client_secret:
            client_secret = unquote(client_secret)
            
        return jsonify({
            'clientSecret': client_secret,
            'paymentIntentId': payment_intent.id
        })
        
    except Exception as e:
        print(f"Error creating payment intent: {e}")
        return jsonify(error=str(e)), 500

@app.route('/session-status', methods=['GET'])
def session_status():
    try:
        session_id = request.args.get('sessionId')
        session = stripe.checkout.Session.retrieve(session_id)
        
        return jsonify(
            status=session.status,
            customer_email=session.customer_details.email if session.customer_details else None
        )
    except Exception as e:
        print(f"Error retrieving session: {e}")
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(port=4242, debug=True)