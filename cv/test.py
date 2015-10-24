import numpy as np
import cv2

cascade_path = "/media/windows/dev/linux-dev/opencv-3.0.0/data/haarcascades/"

face_cascade = cv2.CascadeClassifier(cascade_path + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cascade_path + 'haarcascade_eye.xml')



def main():
	# img = cv2.imread('test.jpg')
	# find_face(img)
	webcam_start()


def find_face(img):
	gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
	faces = face_cascade.detectMultiScale(gray, 1.3, 5)
	for (x,y,w,h) in faces:
	    img = cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
	    roi_gray = gray[y:y+h, x:x+w]
	    roi_color = img[y:y+h, x:x+w]
	    eyes = eye_cascade.detectMultiScale(roi_gray)
	    for (ex,ey,ew,eh) in eyes:
	        cv2.rectangle(roi_color,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)

	return img
	# cv2.imshow('img',img)
	# cv2.waitKey(0)
	# cv2.destroyAllWindows()


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