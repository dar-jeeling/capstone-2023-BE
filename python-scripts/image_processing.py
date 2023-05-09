import sys
import cv2

def process_image(input_file, output_file):
    image = cv2.imread(input_file)
    
    # 이미지를 회색조로 변환합니다.
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    cv2.imwrite(output_file, gray_image)

if __name__ == "__main__":
    print(sys.argv)
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    process_image(input_file, output_file)