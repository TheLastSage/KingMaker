import numpy as np
import cv2
from IPython import embed
import random
import train_model

import cv_machine_learning as ml

clf = ml.load_model('random_forest_clf.model')

cascade_path = "/media/windows/dev/linux-dev/opencv-3.0.0/data/haarcascades/"

face_cascade = cv2.CascadeClassifier(cascade_path + 'haarcascade_frontalface_default.xml')



def main():
	# img = cv2.imread('test.jpg')
	# find_face(img)
	webcam_start()


def find_face(img):
	gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
	faces = face_cascade.detectMultiScale(gray, 1.3, 5)

	cropped_faces = [img[y:y+h, x:x+w] for (x,y,w,h) in faces]
	# create_training_data(cropped_faces)

	for face in cropped_faces:
		doubly_cropped_face = face[1:150, 1:150]
		flattened = doubly_cropped_face.flatten()
		try:
			print('Predicted face:')
			print(clf.predict(flattened))
		except:
			print('Error predicting feature')

	for (x,y,w,h) in faces:
	    img = cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
	    roi_gray = gray[y:y+h, x:x+w]
	    roi_color = img[y:y+h, x:x+w]
	    cropped_faces.append((roi_gray, roi_color))
	    
	return img
	# cv2.imshow('img',img)
	# cv2.waitKey(0)
	# cv2.destroyAllWindows()



def create_training_data(list_of_face_tuples):
	for img_color in list_of_face_tuples:
		cv2.imwrite('test/test_img_' + str(random.randint(1,100)) +'.jpg', img_color)

def webcam_start():
	cap = cv2.VideoCapture(0)
	while(True):
	    # Capture frame-by-frame
	    ret, frame = cap.read()

	    # Our operations on the frame come here
	    # gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

	    gray_found_face = find_face(frame)
	    # Display the resulting frame
	    cv2.imshow('frame',gray_found_face)
	    if cv2.waitKey(1) & 0xFF == ord('q'):
	        break

	# When everything done, release the capture
	cap.release()
	cv2.destroyAllWindows()


if __name__ == "__main__":
    main()