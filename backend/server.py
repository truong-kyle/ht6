import os
from dotenv import load_dotenv, find_dotenv
from flask import Flask, jsonify, redirect, request
import stripe
from pathlib import Path
from flask_cors import CORS

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
            # Build product_data dict conditionally
            product_data = {
                'name': item['name'],
            }
            
            # Only add description if it exists and is not empty
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
            if fee_amount > 0:  # Only add fees with positive amounts
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
        
        session = stripe.checkout.Session.create(
            ui_mode="custom",
            line_items=line_items,
            mode='payment',  # Required for one-time payments
           
        )
        
        return jsonify(client_secret=session.client_secret)
        
    except Exception as e:
        print(f"Error creating checkout session: {e}")
        return jsonify(error=str(e)), 500

@app.route('/session-status', methods=['GET'])
def session_status():
    """Check the status of a Stripe checkout session"""
    try:
        session_id = request.args.get('session_id')
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