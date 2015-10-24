import os
from sklearn import svm
import cv2

if __name__ == 'main':
	main()

def main():
	training_y_values = ['yixin', 'vignesh']
	training_data = get_data('training/', training_y_values)

	testing_y_values = ['yixin', 'vignesh']
	testing_data = get_data('testing/', testing_y_values)

	clf = train_model(training_data)
	validate_model(clf, testing_data)


# Save and load the model

def get_data(dir_path, y_values):
	X = []
	y = []

	for y_value in y_values:
		for filename in os.listdir(dir_path + y_value + '/'):
			img = cv2.imread(dir_path + y_value + '/' + filename)
			gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

			cropped = gray[1:150, 1:150]
			# cropped = img[1:150, 1:150]

			# cv2.imshow('img', cropped)
			# cv2.waitKey(0)
			# cv2.destroyAllWindows()

			flattened = [item for sublist in cropped for item in sublist]
			X.append(flattened)
			y.append(y_value)


	return (X,y)

def train_model(test_data):
	X,y = test_data
	clf = svm.SVC()
	clf.fit(X,y)
	return clf

def validate_model(clf, test_data):
	X,y = test_data
	numCorrect = 0
	numIncorrect = 0
	for i in range(len(X)):
		if clf.predict(X[i]) == y[i]:
			numCorrect += 1
		else:
			numIncorrect +=1
	print("Percent correct: " + str(numCorrect/(1.0*len(X))))
	print("Percent incorrect: " + str(numIncorrect/(1.0*len(X))))

def save_model(classifier, filename):
	pickle.dump(classifier, filename)	

def load_model(filename):
	return pickle.load(open(filename))

