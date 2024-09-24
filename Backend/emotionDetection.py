from fer import FER
import cv2
import sys
import os

def detect_emotion(image_path):
    # Check if the image exists
    if not os.path.exists(image_path):
        raise ValueError(f"Image not found: {image_path}")
    
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not load image at path: {image_path}")
    
    # Resize the image to make processing faster
    img = cv2.resize(img, (400, 400))  # Resize to 400x400 pixels
    
    # Initialize emotion detector
    detector = FER()
    emotion, score = detector.top_emotion(img)

    if emotion is None:
        print("No emotion detected")
        sys.exit(1)  # Exit with a non-zero status code

    print(emotion)  # Only print the emotion

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("No image path provided")
        sys.exit(1)

    image_path = sys.argv[1]
    print(f"Processing image: {image_path}")
    try:
        detect_emotion(image_path)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
