import numpy as np
import cv2
from IPython import embed
import random
import requests, time

import cv_machine_learning as ml

clf = ml.load_model('people_classifier.model')

cascade_path = "trained_classifiers/"

face_cascade = cv2.CascadeClassifier(cascade_path + 'haarcascade_frontalface_default.xml')

# banana_cascade = cv2.CascadeClassifier(cascade_path + 'banana_classifier.xml')

# milk_cascade = cv2.CascadeClassifier(cascade_path + 'milk_classifier.xml')

end_thread = False

def main():
	# img = cv2.imread('test.jpg')
	# find_face(img)
	webcam_start()


def find_face(img):
	gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

	# Faces

	faces = face_cascade.detectMultiScale(gray, 1.3, 5)

	cropped_faces = [img[y:y+h, x:x+w] for (x,y,w,h) in faces]
	# create_training_data(cropped_faces)

	prediction = None

	for face in cropped_faces:
		doubly_cropped_face = face[1:150, 1:150]
		resized = cv2.resize(doubly_cropped_face, (150,150))
		flattened = resized.flatten()
		try:
			# print('Predicted face:')
			prediction = clf.predict(flattened)
			# print(prediction)
		except:
			pass
			# print('Error predicting face')
	if prediction:
		img = cv2.putText(img, prediction[0], (20,100), cv2.FONT_HERSHEY_SIMPLEX, 2, 255, 3)

	for (x,y,w,h) in faces:
	    img = cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
	    roi_gray = gray[y:y+h, x:x+w]
	    roi_color = img[y:y+h, x:x+w]
	    cropped_faces.append((roi_gray, roi_color))

    # Bananas

	# bananas = banana_cascade.detectMultiScale(gray, 1.3, 5)
	# for (x,y,w,h) in bananas:
	# 	img = cv2.rectangle(img, (x,y), (x+w, y+h), (0,255,0), 2)
	# 	try:
	# 		print('Found a banana')
	# 	except:
	# 		pass


    # Bananas

	# milks = milk_cascade.detectMultiScale(gray, 1.3, 5)
	# for (x,y,w,h) in milks:
	# 	img = cv2.rectangle(img, (x,y), (x+w, y+h), (0,255,0), 2)
	# 	try:
	# 		print('Found car')
	# 	except:
	# 		pass
	return img, prediction
	# cv2.imshow('img',img)
	# cv2.waitKey(0)
	# cv2.destroyAllWindows()



def create_training_data(list_of_face_tuples):
	for img_color in list_of_face_tuples:
		cv2.imwrite('test/test_img_' + str(random.randint(1,100)) +'.jpg', img_color)

def curr_time():
	return int(time.time())

import threading
prediction = None
def webcam_start():
	cap = cv2.VideoCapture(0)
	while(True):
	    # Capture frame-by-frame
	    ret, frame = cap.read()
	    # Our operations on the frame come here
	    # gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
	    global prediction
	    gray_found_face, prediction = find_face(frame)
	    # Display the resulting frame
	    cv2.imshow('frame',gray_found_face)

	    if cv2.waitKey(1) & 0xFF == ord('q'):
	        break

	# When everything done, release the capture
	end_thread = True
	cap.release()
	cv2.destroyAllWindows()

def send_info():
	time = curr_time()
	global prediction
	while not end_thread:
		if prediction and curr_time() > time:
			# print(prediction)
			time = curr_time()
			r = requests.post("http://kingmaker.meteor.com/inputStream",
			data = {"person": prediction[0]})	

t = threading.Thread(name='sending_info', target=send_info)
t.start()

if __name__ == "__main__":
    main()