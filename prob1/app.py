from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

# Initialize flask app
app = Flask(__name__)
CORS(app)

# Handle the index route, only allowing GET requests
@app.route("/", methods=["GET"])
def index():

    # Get the rolled value from the frontend as a URL param
    rolled = request.args.get("got")

    # Open the log file
    log = open("roll_history.log", "a")

    # Get the current date and tie
    now = datetime.now()
    formatted_time = now.strftime("%d/%m/%Y %H:%M:%S")

    # Print and write to the log file
    print(f"Rolled {rolled} at {formatted_time}", flush=True)
    log.writelines(f"Rolled {rolled} at {formatted_time}\n")

    # Return a successful response
    return jsonify({ "success": True })

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")