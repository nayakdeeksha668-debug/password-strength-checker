

from flask import Flask, render_template, request, jsonify

from password_checker import check_password

# Create Flask application
app = Flask(__name__)


# Homepage
@app.route("/")
def home():
    return render_template("index.html")


# Password checking API
@app.route("/check-password", methods=["POST"])
def check():

    # Receive JSON data
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Invalid request data"
        }), 400

    # Get password
    password = data.get("password")

    # Validate password
    if not isinstance(password, str) or not password:
        return jsonify({
            "error": "Please enter a password"
        }), 400

    if len(password) > 256:
        return jsonify({
            "error": "Password is too long"
        }), 400

    # Check password using Python function
    result = check_password(password)

    # Send result to website
    return jsonify(result)


# Start application
if __name__ == "__main__":
    app.run(debug=True)
