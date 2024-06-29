from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from data_processing import get_pay

# Initialize flask app
app = Flask(__name__)
CORS(app)

# .csv extension validation 
def allowed_file(filename):
    return filename.split(".")[1] == "csv"

# Handle the index route for file upload
@app.route("/", methods=["POST"])
def index():
    # Validate that the request has the file
    if 'file' not in request.files:
        return jsonify({ "ok": False, "message": "There is not a file attached" })

    file = request.files["file"]

    # Validate so file won't have an invalid name and wrong extension
    if not file.filename or not allowed_file(file.filename):
        return jsonify({ "ok": False, "message": "The file name is invalid, make sure you are uploading a .csv file" })

    # Return the processed data with a success flag
    try:
        return jsonify({ "ok": True, "payroll": get_pay(file) })
    except Exception as e:
        return jsonify({ "ok": False, "message": str(e)})

    
    

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")