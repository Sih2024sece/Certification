import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import warnings
from paddleocr import PaddleOCR
import cv2
import re
# Initialize the PaddleOCR model
ocr = PaddleOCR(use_angle_cls=True, lang='en')

warnings.filterwarnings("ignore", category=FutureWarning)

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST"], "allow_headers": "*"}})

def read_image_file(file):
    # Read the image file object into a byte stream
    file_bytes = file.read()
    
    # Convert byte stream to a NumPy array
    img_array = np.frombuffer(file_bytes, np.uint8)
    
    # Decode the image array to an OpenCV image
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    
    return img

@app.route('/getfile', methods=['POST'])
def getfile():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Read and process the uploaded file
    img_path = read_image_file(file)
    result = ocr.ocr(img_path, cls=True)

    detected_texts = []
    c=""
    for line in result:
        for word_info in line:
            text = word_info[1][0]
            confidence = word_info[1][1]
            if confidence > 0.90:  # 90% confidence threshold
                c+=text
                c+=" "
    pan_pattern = r'\b[A-Z]{5}[0-9]{4}[A-Z]\b'
    number = re.findall(pan_pattern, c)
    return jsonify({"content": c,"UI":number[0]})

if __name__ == '__main__':
    app.run(debug=True)
