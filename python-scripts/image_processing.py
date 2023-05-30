from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
from tensorflow.keras.applications.xception import preprocess_input
import numpy as np
import sys
import cv2
import os

LABELS = [
  'Adidas',
  'Apple',
  'BMW',
  'Citroen',
  'Cocacola',
  'DHL',
  'Fedex',
  'Ferrari',
  'Ford',
  'Google',
  'Heineken',
  'HP',
  'Intel',
  'McDonalds',
  'Mini',
  'Nbc',
  'Nike',
  'Pepsi',
  'Porsche',
  'Puma',
  'RedBull',
  'Sprite',
  'Starbucks',
  'Texaco',
  'Unicef',
  'Vodafone',
  'Yahoo',
];
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
MODEL_PATH = os.path.join(CURRENT_DIR, '..', 'model', 'logo.model')

def draw_label(img, text, pos, bg_color):
    font_scale = 1
    font_thickness = 2

    text_size, _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, font_thickness)
    text_w, text_h = text_size

    # Padding around the text.
    pad_x, pad_y = 5, 5  # You can adjust padding as per your needs.

    start_x, start_y = pos
    end_x, end_y = start_x + text_w + 2 * pad_x, start_y - text_h - 2 * pad_y

    # Check if the text box is out of the image
    start_x = max(0, start_x)
    start_y = max(0, start_y)
    end_x = min(img.shape[1] - 1, end_x)
    end_y = min(img.shape[0] - 1, end_y)

    # Draw the rectangle background for text.
    cv2.rectangle(img, (start_x, start_y), (end_x, end_y), bg_color, -1)

    # Draw the text on image.
    cv2.putText(img, text, (start_x + pad_x, start_y - pad_y), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (0, 0, 0), font_thickness, cv2.LINE_AA)

def process_image(input_file, output_file):
    # 모델 불러오기
    model = load_model(MODEL_PATH)

    # 이미지 불러오기
    img = load_img(input_file, target_size=(224, 224))
    img = img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = preprocess_input(img)

    # 모델로 이미지를 예측하기
    pred = model.predict(img)

    # 예측 결과에서 가장 높은 확률의 클래스를 가져오기
    result = np.argmax(pred)

    # 예측 결과 이미지를 저장
    image = cv2.imread(input_file)
    # cv2.putText(image, LABELS[result], (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
    label = LABELS[result]
    
    # Calculate the position for text (Bottom Center).
    text_pos_x = max(0, image.shape[1] // 2 - (len(label) * 10) // 2)  # Adjust this to position text.
    text_pos_y = image.shape[0] - 20  # Place the text 20 pixels above the bottom of the image

    draw_label(image, label, (text_pos_x, text_pos_y), (255, 255, 255))

    
    cv2.imwrite(output_file, image)

   # 이미지 처리 결과와 라벨 번호를 함께 반환
    return output_file, result

if __name__ == "__main__":
    print(sys.argv)
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    output_file, result_label = process_image(input_file, output_file)
    print(f"{output_file},{result_label}")
