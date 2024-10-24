import sys
import base64
import numpy as np
import cv2
from fer import FER

def detect_emotion_from_image(image):
    # Initialize the emotion detector
    detector = FER()
    emotion, score = detector.top_emotion(image)
    return emotion

if __name__ == '__main__':
    # Read base64 image data from stdin
    base64_image = sys.stdin.read().strip()  # Read from stdin and remove any extra newlines

    if not base64_image:
        print("No image data provided", file=sys.stderr)
        sys.exit(1)

    try:
        # Decode the base64 string into bytes
        image_data = base64.b64decode(base64_image)

        # Convert the byte data into a NumPy array
        np_image = np.frombuffer(image_data, dtype=np.uint8)

        # Decode the NumPy array into an image using OpenCV
        img = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

        if img is None:
            print("Error decoding image", file=sys.stderr)
            sys.exit(1)

        # Detect emotion from the decoded image
        emotion = detect_emotion_from_image(img)

        if emotion:
            print(emotion)
        else:
            print("No emotion detected")
            sys.exit(1)

    except Exception as e:
        sys.exit(1)
