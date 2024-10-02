# Face and Emotion Detection Web App

This is a web-based application that uses the webcam to detect faces, emotions, age, and gender in real time. The app leverages the `face-api.js` library to provide the face detection and emotion classification functionality.

## Features

- Detects face(s) from a webcam feed.
- Identifies emotions such as happy, sad, angry, etc.
- Estimates age and gender from detected faces.
- Displays the results, including confidence scores for each detection.
- Interactive UI with a clean design, including start and stop controls for the webcam feed.

## Demo

You can try the app live on GitHub Pages:  
[Live Demo](https://chshankar19.github.io/FaceDetection-App)

## Installation and Setup

Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/chshankar19/FaceDetection-App.git
   
Navigate into the project directory:
cd FaceDetection-App
Ensure that the necessary face-api.js models are available in the models folder:

tiny_face_detector_model-weights_manifest.json
tiny_face_detector_model-shard1.bin
face_expression_model-weights_manifest.json
face_expression_model-shard1.bin
age_gender_model-weights_manifest.json
age_gender_model-shard1.bin

If the models are not in the project, you can download them from the official face-api.js repository:

Download the required models from here.
Open index.html in your browser to run the app locally.

## Usage
Once the app is loaded, click on the Start Webcam button to start the webcam feed.
The app will detect faces and display the bounding box with emotion, age, and gender predictions.
Click on the Stop Webcam button to stop the webcam and capture the last frame with the results.

## Models Used
The project uses the following models from the face-api.js library:

Tiny Face Detector: For detecting faces in real-time with low computational cost.
Face Expression Recognition Model: For predicting emotions based on facial expressions.
Age and Gender Model: For estimating the age and gender of the detected face.
Model Sources
All models are hosted in the /models directory and are loaded directly in the app. You can replace or update these models from the face-api.js repository if needed.

## Project Structure


├── index.html        # Main HTML file for the app
├── script.js         # JavaScript file containing the face detection logic
├── style.css         # CSS file for styling the web app
├── models/           # Directory containing the face-api.js models
└── README.md         # Project documentation

## Technologies Used
HTML5: Markup language used for structuring the web app.
CSS3: For styling the user interface.
JavaScript: Logic for handling face detection, webcam feed, and model integration.
face-api.js: JavaScript library for face detection and emotion recognition.
Known Issues
If you see a 404 (Not Found) error for the models, ensure that the model files are uploaded to the correct directory.
Ensure the webcam is permitted in your browser for the app to function correctly.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contributing
Contributions are welcome! If you would like to contribute, please fork the repository and submit a pull request.
