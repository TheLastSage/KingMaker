import sys, os
import cv2
from IPython import embed
import random

def save_windows(img, width, height, name):
	for i in range(0, len(img)-width-1, 10):
		for j in range(0, len(img[0])-height-1, 10):
			curr = img[i:i+width, j:j+height]
			cv2.imwrite(name + '/test_img_' + str(random.randint(1,1000)) +'.jpg', curr)

object_name = raw_input("Enter the name of the object: ")

cap = cv2.VideoCapture(0)

if not os.path.exists(object_name):
    os.makedirs(object_name)

while True:
	keep_going = raw_input("Continue recording? (y/n)\n")
	if keep_going == 'n':
		break

	ret, frame = cap.read()
	cv2.imshow('frame',frame)

	save_windows(frame, 150, 150, object_name)

	if cv2.waitKey(1) & 0xFF == ord('q'):
		break


cap.release()
cv2.destroyAllWindows()


