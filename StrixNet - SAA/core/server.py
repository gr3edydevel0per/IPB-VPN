from flask import render_template, request, session, jsonify, redirect, url_for, Flask
from core.utils.api_helper import api_request
from core.utils.device_posture import DevicePostureChecker
from core.utils.device_data import get_device_data
from core.utils.vpn_manager import VPNManager
from core.utils.api_server import API_URL, USER_URL, DEVICE_URL
from core.utils.wg_manager import WGManager
import os

app = Flask(__name__)
app.secret_key = "YOUR-SECRET-LEY"

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'user_data' not in session:
        return redirect(url_for('home'))

    return render_template(
        'investment_dashboard.html', 
        userlogged=session.get('user_data')
    )

@app.route('/vpn')
def vpn():
    if 'token' not in session:
        return redirect(url_for('home'))

    vpn_manager = VPNManager(uuid=session.get('user_data')['uuid'], session_token=session)
    vpn_manager.stop_vpn()
    wg_manager = WGManager(uuid=session.get('user_data')['uuid'])
    wg_manager.start_wireguard_service()
    private_ip = "10.0.11.2"

    return render_template(
        'vpn.html', 
        success='success', 
        userlogged=session.get('user_data'), 
        device_data=session.get('device_data'), 
        device_trusted="Device is trusted", 
        private_ip=private_ip
    )

@app.route('/connectVPN')
def connect_vpn():
    vpn_manager = VPNManager(uuid=session.get('user_data')['uuid'], session_token=session)
    vpn_result = vpn_manager.start_vpn()
    return render_template('connection.html', uuid=session.get('user_data')['uuid'],token=session.get('token'))

@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    if not email or not password:
        return render_template('login.html', error="Email and password are required")

    response = api_request(f'{USER_URL}/login', method='POST', json={'email': email, 'password': password})

    if response.get('status') == 'success':
        session['token'] = response['data']['token']
        session['user_data'] = response['data']['user']
        session['device_data'] = get_device_data()
        return redirect(url_for('dashboard'))
    else:
        return render_template('login.html', error=response.get('message', 'Login failed'))

@app.route('/logout')
def logout():
    if 'user_data' in session:
            # vpn_manager = VPNManager(uuid=session.get('user_data')['uuid'], session_token=session)
            # vpn_manager.stop_vpn()
            wg_manager = WGManager(uuid=session.get('user_data')['uuid'])
            wg_manager.stop_wireguard_service()
    session.clear()
    return jsonify({"status": "success", "redirect": url_for('home')})

@app.route('/api/device_posture')
def device_posture():
    if 'token' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    health_checker = DevicePostureChecker()
    posture_data = health_checker.run_device_posture_check()
    return jsonify(posture_data)

@app.route('/api/window_state')
def window_state():
    return jsonify({
        "is_minimized": False,
        "is_visible": True
    })

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    if 'user_data' not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.get_json()
    preference = data.get('preference')
    plan = data.get('plan')
    
    # Generate recommendations based on preference and plan
    recommendations = generate_recommendations(preference, plan)
    
    return jsonify({
        "status": "success",
        "recommendations": recommendations
    })

def generate_recommendations(preference, plan):
    """Generate investment recommendations based on user preferences and plan"""
    import random
    
    # Sample data for different investment types
    stocks_data = [
        {"name": "Apple Inc.", "symbol": "AAPL", "sector": "Technology"},
        {"name": "Microsoft Corp.", "symbol": "MSFT", "sector": "Technology"},
        {"name": "Amazon.com Inc.", "symbol": "AMZN", "sector": "E-commerce"},
        {"name": "Tesla Inc.", "symbol": "TSLA", "sector": "Automotive"},
        {"name": "Alphabet Inc.", "symbol": "GOOGL", "sector": "Technology"},
        {"name": "Johnson & Johnson", "symbol": "JNJ", "sector": "Healthcare"},
        {"name": "JPMorgan Chase", "symbol": "JPM", "sector": "Finance"},
        {"name": "Visa Inc.", "symbol": "V", "sector": "Finance"}
    ]
    
    mutual_funds_data = [
        {"name": "Vanguard 500 Index Fund", "type": "Large Cap", "manager": "Vanguard"},
        {"name": "Fidelity Growth Fund", "type": "Growth", "manager": "Fidelity"},
        {"name": "T. Rowe Price Blue Chip", "type": "Large Cap", "manager": "T. Rowe Price"},
        {"name": "American Funds Growth", "type": "Growth", "manager": "American Funds"},
        {"name": "PIMCO Income Fund", "type": "Fixed Income", "manager": "PIMCO"},
        {"name": "BlackRock Global Fund", "type": "Global", "manager": "BlackRock"}
    ]
    
    bonds_data = [
        {"name": "US Treasury 10-Year", "issuer": "US Government", "maturity": "10 Years"},
        {"name": "Corporate Bond AAA", "issuer": "Apple Inc.", "maturity": "5 Years"},
        {"name": "Municipal Bond", "issuer": "California State", "maturity": "7 Years"},
        {"name": "US Treasury 5-Year", "issuer": "US Government", "maturity": "5 Years"},
        {"name": "Corporate Bond AA", "issuer": "Microsoft", "maturity": "10 Years"}
    ]
    
    # Risk and return profiles based on plan
    risk_profiles = {
        "conservative": {"risk": "Low", "return_range": (3, 7)},
        "moderate": {"risk": "Medium", "return_range": (7, 12)},
        "aggressive": {"risk": "High", "return_range": (12, 20)}
    }
    
    profile = risk_profiles.get(plan, risk_profiles["moderate"])
    recommendations = []
    
    # Select data based on preference
    if preference == "stocks":
        data_source = stocks_data
        count = 6
    elif preference == "mutual-funds":
        data_source = mutual_funds_data
        count = 5
    elif preference == "bonds":
        data_source = bonds_data
        count = 4
    else:
        data_source = stocks_data
        count = 6
    
    # Generate recommendations
    selected_items = random.sample(data_source, min(count, len(data_source)))
    
    for item in selected_items:
        rec = {
            "name": item["name"],
            "type": preference,
            "price": round(random.uniform(50, 500), 2),
            "change": round(random.uniform(-5, 10), 2),
            "risk": profile["risk"],
            "expectedReturn": round(random.uniform(*profile["return_range"]), 1),
            "rating": random.randint(3, 5),
            "description": f"A {profile['risk'].lower()}-risk investment opportunity with strong potential returns. "
        }
        
        # Add specific description based on type
        if preference == "stocks":
            rec["description"] += f"This {item.get('sector', 'diversified')} sector stock has shown consistent growth."
        elif preference == "mutual-funds":
            rec["description"] += f"Managed by {item.get('manager', 'professional managers')} with a proven track record."
        elif preference == "bonds":
            rec["description"] += f"Issued by {item.get('issuer', 'reputable institution')} with {item.get('maturity', 'medium-term')} maturity."
        
        recommendations.append(rec)
    
    return recommendations

def start_app():
    app.run(host="127.0.0.1",debug=False, use_reloader=False)
