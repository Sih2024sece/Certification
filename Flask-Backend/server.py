from flask import Flask, jsonify, request
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image
import easyocr
import re
import warnings

warnings.filterwarnings("ignore", category=FutureWarning)

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST"], "allow_headers": "*"}})

@app.route('/getfile', methods=['POST'])
def getfile():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    file_stream = file.read()
    np_arr = np.frombuffer(file_stream, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if image is None:
        return jsonify({"error": "Image not found or cannot be read"}), 400

    image = cv2.resize(image, (800, 800))
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    sharp = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

    reader = easyocr.Reader(['en'], gpu=False)
    results = reader.readtext(sharp)
    text_data = ' '.join([text for (_, text, _) in results])

    response = jsonify({"message": "File successfully uploaded", "content": text_data})
    return response

if __name__ == '__main__':
    app.run(debug=True)
