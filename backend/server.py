import os
from dotenv import load_dotenv, find_dotenv
from flask import Flask, jsonify, redirect, request
import stripe
from pathlib import Path
from flask_cors import CORS

load_dotenv(find_dotenv(usecwd=True))

stripe.api_key = os.getenv("STRIPE_SECRET")

app = Flask(__name__, static_url_path="", static_folder="public")
CORS(app)
domain = "http://localhost:5173"

cart = []

@app.route('/order/<path:item_id>', methods=['POST'])
def add_item(item_id):
    item_details = request.json
    print(item_details)
    return jsonify(success=True, item=item_details, item_id=item_id)

@app.route('/order/modify', methods=['POST'])
def modify_order():
    global cart
    cart = []
    return jsonify(success=True, message="Backend cart cleared")


if __name__ == '__main__':
    app.run(port=4242)