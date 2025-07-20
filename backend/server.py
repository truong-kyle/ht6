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
        
        # Build line items array
        line_items = []
        
        # Add main items
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
        
        # Add custom fees as separate line items
        for fee_name, fee_amount in fees.items():
            line_items.append({
                'price_data': {
                    'currency': 'cad',
                    'product_data': {
                        'name': fee_name.replace('_', ' ').title(),
                        'description': f'{fee_name.replace("_", " ").title()} fee',
                    },
                    'unit_amount': int(fee_amount * 100),  # Convert to cents
                },
                'quantity': 1,
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
        
        # Decode the client secret if it's URL encoded
        client_secret = session.client_secret
        if client_secret and '%' in client_secret:
            client_secret = unquote(client_secret)
            print(f"Decoded client secret: {client_secret}")

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
        
        # Calculate total amount
        total_amount = 0
        
        # Add main items
        for item in items:
            total_amount += int(item['price'] * 100) * item.get('quantity', 1)
        
        # Add fees
        for fee_name, fee_amount in fees.items():
            total_amount += int(fee_amount * 100)
        
        # Create a Payment Intent
        payment_intent = stripe.PaymentIntent.create(
            amount=total_amount,
            currency='cad',
            metadata={
                'items': str(items),  # Store items info for reference
                'fees': str(fees)
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
    print("THIS IS THE PART THATS FAILING")
    """Check the status of a Stripe checkout session"""
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