import os
from dotenv import load_dotenv, find_dotenv
from flask import Flask, jsonify, redirect, request
import stripe
from pathlib import Path

load_dotenv(find_dotenv(usecwd=True))

stripe.api_key = os.getenv("STRIPE_SECRET")
stripe.api_version = '2025-06-30.basil'

app = Flask(__name__, static_url_path="", static_folder="public")
domain = "http://localhost:5173"

@app.route('/start-checkout', methods=['POST'])
def start_checkout():
    try:
        session = stripe.checkout.Session.create(
            ui_mode='custom', line_items= [{
                'price': '{{PRICE_ID}}',
                'quantity': 1
            }], mode='payment', return_url=domain + '/complete?session_id={CHECKOUT_SESSION_ID}',
        )
    except Exception as e:
        return str(e)
    return jsonify(clientSecret = session.client_secret)

@app.route('/session-status', methods=['GET'])
def session_status():
  session = stripe.checkout.Session.retrieve(request.args.get('session_id'), expand=["payment_intent"])

  return jsonify(status=session.status, payment_status=session.payment_status, payment_intent_id=session.payment_intent.id, payment_intent_status=session.payment_intent.status)

if __name__ == '__main__':
    app.run(port=4242)