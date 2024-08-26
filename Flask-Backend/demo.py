import cv2
import numpy as np
from PIL import Image
import easyocr
import re
import warnings

warnings.filterwarnings("ignore", category=FutureWarning)

image_path = r'D:\SIH_Block\Project-main-file\Flask-Backend\image.png'
image = cv2.imread(image_path)

if image is None:
    raise FileNotFoundError(f"Image not found at path: {image_path}")

image = cv2.resize(image, (800, 800))

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

sharp = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

reader = easyocr.Reader(['en'], gpu=False)

results = reader.readtext(sharp)

text_data = ' '.join([text for (_, text, _) in results])
print(text_data)
