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

def pan(img):
  result = ocr.ocr(img, cls=True)

  keywords_to_remove = ['/Name', '/Signature', 'Date of Birth']

  text_lines = [word_info[1][0] for line in result for word_info in line]
  confidences = [word_info[1][1] for line in result for word_info in line]

  income_tax_index = next((i for i, text in enumerate(text_lines) if 'income tax' in text.lower()), None)

  processed_text = []
  for i, (text, confidence) in enumerate(zip(text_lines, confidences)):
      if income_tax_index is None or i >= income_tax_index:
          if not any(keyword in text for keyword in keywords_to_remove):
              if confidence > 0.90:
                  cleaned_text = re.sub(r'[^a-zA-Z0-9]', '', text).lower()
                  processed_text.append(cleaned_text)

  result_string = ''.join(processed_text)
  #print("Result String:", result_string)

  pan_pattern = r'[a-z]{5}[0-9]{4}[a-z]'
  ui = re.findall(pan_pattern, result_string)
  #print("PAN Card: ", ui)
  return jsonify({"ui": ui[0],"content":result_string})


def driver(img):
  result = ocr.ocr(img, cls=True)

  text_lines = [word_info[1][0] for line in result for word_info in line]
  confidences = [word_info[1][1] for line in result for word_info in line]

  processed_text = []
  for i, (text, confidence) in enumerate(zip(text_lines, confidences)):
              if confidence > 0.90:
                  cleaned_text = re.sub(r'[^a-zA-Z0-9]', '', text).lower()
                  processed_text.append(cleaned_text)
  #print(processed_text)

  result_string = ''.join(processed_text)
  print("Result String:", result_string)

  lic_no = r'tn\d{13}'
  ui = re.findall(lic_no, result_string)
  print("License Number: ", ui[0])


def mark(img):
  result = ocr.ocr(img, cls=True)
  text_lines = [word_info[1][0] for line in result for word_info in line]
  confidences = [word_info[1][1] for line in result for word_info in line]

  processed_text = []
  for i, (text, confidence) in enumerate(zip(text_lines, confidences)):
              if confidence > 0.90:
                  cleaned_text = re.sub(r'[^a-zA-Z0-9]', '', text).lower()
                  processed_text.append(cleaned_text)

  #print(processed_text)

  result_string = ''.join(processed_text)
  print("Result String:", result_string)


  si_no = r'sino(\d{6})'
  ui = re.findall(si_no, result_string)
  print("SI No: ",ui)


def aadhaar(img_path):
  #img_path = read_image_file(file)
  result = ocr.ocr(img_path, cls=True)

  text_lines = [word_info[1][0] for line in result for word_info in line]
  confidences = [word_info[1][1] for line in result for word_info in line]

  processed_text = []
  for i, (text, confidence) in enumerate(zip(text_lines, confidences)):
              if confidence > 0.90:
                  cleaned_text = re.sub(r'[^a-zA-Z0-9]', '', text).lower()
                  processed_text.append(cleaned_text)

  result_string = ''.join(processed_text)
  #print("Result String:", result_string)

  aad_no = r'\d{12}'
  uii = re.findall(aad_no, result_string)
  #print("Aadhaar Number: ",uii)
  return jsonify({"ui": uii[0],"content":result_string})

@app.route('/getfile', methods=['POST'])
def getfile():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Read and process the uploaded file
    img = read_image_file(file)
    ui = request.form['type']
    if ui == "pan":
        return pan(img)
    elif ui == "Drivers License":
        driver(img)
    elif ui == "Mark Sheet":
        mark(img)
    elif ui == "aadhaar":
        return aadhaar(img)
    else:
        print("Invalid Input")
    return jsonify({"detected_texts": ui})

if __name__ == '__main__':
    app.run(debug=True)
