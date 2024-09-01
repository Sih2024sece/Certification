import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
import numpy as np
import io
import re
import warnings
from paddleocr import PaddleOCR

warnings.filterwarnings("ignore", category=FutureWarning)

app = Flask(__name__)

# Initialize the PaddleOCR model
ocr = PaddleOCR(use_angle_cls=True, lang='en', gpu=False)

CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST"], "allow_headers": "*"}})

# Directory to save uploaded files temporarily
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route('/getfile', methods=['POST'])
def getfile():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the uploaded file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    # Process the saved file with PaddleOCR
    result = ocr.ocr(file_path, cls=True)
    
    # Remove the file after processing
    os.remove(file_path)
    
    extracted_text = []
    for line in result:
        for word in line:
            extracted_text.append(word[1][0])

    # Define regex patterns
    aadhaar_number_pattern = re.compile(r'\b\d{12}\b')
    aadhaar_number_pattern1 = re.compile(r'\d{4}\s\d{4}\s\d{4}')
    vid_pattern = re.compile(r'\b\d{4}\s\d{4}\s\d{4}\s\d{4}\b')
    dob_pattern = re.compile(r'DOB:\s*\d{2}/\d{2}/\d{4}')
    dob_pattern1 = re.compile(r'\/DOB(\d{2}\/\d{2}\/\d{4})') 
    dob_pattern2 = re.compile(r'/DOB:(\d{2}-\d{2}-\d{4})')
    issued_date_pattern = re.compile(r'(\d{2}/\d{2}/\d{4})')
    address_pattern = re.compile(r'(.*\d{6})')
    name_pattern = re.compile(r'^[A-Za-z\s\-\'\.]+$')
    issue_date_pattern = re.compile(r'(Issue\s*Date:\s*\d{2}/\d{2}/\d{4}|IssueDate:\s*\d{2}/\d{2}/\d{4})')
    issue_date_pattern1 = re.compile(r'ad Date:\d{2}/\d{2}/\d{4}')

    # Initialize fields
    aadhaar_number = None
    dob = None
    issued_date = None
    name = None
    address = None
    vid = None

    for line in extracted_text:
        if aadhaar_number is None:
            match1 = aadhaar_number_pattern.search(line)
            match2 = aadhaar_number_pattern1.search(line)

            if match1:
                aadhaar_number = match1.group(0)
            elif match2:
                aadhaar_number = match2.group(0)

        if vid is None and vid_pattern.search(line):
            vid = vid_pattern.search(line).group(0)

        if dob is None:
            match1 = dob_pattern.search(line)
            match2 = dob_pattern1.search(line)
            match3 = dob_pattern2.search(line)

            if match1:
                dob = match1.group(0).split('DOB:')[-1].strip()
            elif match2:
                dob = match2.group(1)
            elif match3:
                dob = match3.group(0).split('DOB:')[-1].strip()

        if issued_date is None and issued_date_pattern.search(line):
            issued_date = issued_date_pattern.search(line).group(1)

    for i, text in enumerate(extracted_text):
        if issue_date_pattern.search(text) or issue_date_pattern1.search(text):
            if i + 1 < len(extracted_text):
                potential_name = extracted_text[i + 1].strip()
                if name_pattern.match(potential_name):
                    name = potential_name
            break

    address_lines = []
    collecting_address = False

    for line in extracted_text:
        if collecting_address:
            address_lines.append(line)
            if address_pattern.search(line):
                address = " ".join(address_lines)
                collecting_address = False

        if "Address" in line:
            collecting_address = True
            address_lines.append(line)

    if not address:
        address = " ".join(address_lines)

    # Return the extracted information as a JSON response
    return jsonify({
        'Name': name,
        'Date of Birth': dob,
        'Aadhaar Number': aadhaar_number,
        'Issued Date': issued_date,
        'Address': address,
        'VID': vid
    })


if __name__ == '__main__':
    app.run(debug=True)
