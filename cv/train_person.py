import numpy as np
import cv2
import random
# import train_model
import os
from IPython import embed
import cv_machine_learning as ml

cascade_path = "trained_classifiers/"
face_cascade = cv2.CascadeClassifier(cascade_path + 'haarcascade_frontalface_default.xml')

def webcam_start(curr_person):
	cap = cv2.VideoCapture(0)
	face_count = 0
	while face_count <= 1000:
		ret, frame = cap.read()
		img, faces = find_face(frame)
		write_faces(faces, curr_person)
		face_count += len(faces)
		cv2.imshow('frame', img)
		if cv2.waitKey(1) & 0xFF == ord('q'):
			break
	cap.release()
	cv2.destroyAllWindows()
	
def find_face(img):
	gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
	faces = face_cascade.detectMultiScale(gray, 1.3, 5)
	cropped_faces = [img[y:y+h, x:x+w] for (x,y,w,h) in faces]
	for (x,y,w,h) in faces:
		img = cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
	return img, cropped_faces

def write_faces(faces, curr_person):
	for face in faces:
		resized_face = cv2.resize(face, (150,150))
		cv2.imwrite('people/'+curr_person+'/img_'+str(random.randint(1,10000))+'.jpg',
		 resized_face)

def train_and_save_model():
	X, y = [], []
	people = os.listdir('people')	
	for person in people:
		person_path = 'people/'+person+'/'
		for filename in os.listdir(person_path):
			img = cv2.imread(person_path+filename)
			flattened = img.flatten()

			X.append(flattened)
			y.append(person)
	Xtrain, Xtest, ytrain, ytest = test_and_train_sets(X,y)
	clf = ml.train_model((Xtrain, ytrain))
	ml.save_model(clf, 'people_classifier.model')
	ml.validate_model(clf, (Xtest, ytest))


def test_and_train_sets(X,y):
	indices = range(len(X))
	random.shuffle(indices)	
	Xshuffled = [X[i] for i in indices]
	yshuffled = [y[i] for i in indices]

	Xtrain = Xshuffled[0:len(X)*9/10]
	Xtest = Xshuffled[len(X)*9/10:len(X)]
	ytrain = yshuffled[0:len(y)*9/10]
	ytest = yshuffled[len(y)*9/10:len(y)]	

	return Xtrain, Xtest, ytrain, ytest



def main():
	curr_person = raw_input('Enter the name of the person to be trained\n')
	if not os.path.exists('people/'+curr_person+'/'):
		os.makedirs('people/'+curr_person+'/')
	webcam_start(curr_person)
	train_and_save_model()

if __name__ == '__main__':
	main()