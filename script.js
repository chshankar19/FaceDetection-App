let webcamElement, canvasElement, outputCanvasElement, emotionLabel, stream, detectionInterval;
let isWebcamRunning = false;
let finalEmotion = '';
let finalScore = '';

async function loadModels() {
    if (typeof faceapi === "undefined") {
        console.error("face-api.js is not loaded properly.");
        return;
    }

    try {
        console.log('Loading models...');
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        await faceapi.nets.ageGenderNet.loadFromUri('/models'); 

        console.log('Models Loaded Successfully');
    } catch (error) {
        console.error("Error loading models:", error);
    }
}

async function detectFaceAndEmotion() {
    const detection = await faceapi.detectSingleFace(webcamElement, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions().withAgeAndGender();

    if (detection) {
        const context = canvasElement.getContext('2d');

        // Clear the canvas for each new detection
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);

        const resizedDetections = faceapi.resizeResults(detection, {
            width: canvasElement.width,
            height: canvasElement.height,
        });

        // Draw bounding box (face detection)
        faceapi.draw.drawDetections(canvasElement, resizedDetections);

        const expressions = resizedDetections.expressions;
        const maxExpression = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);

        // Update detected emotion and confidence
        finalEmotion = maxExpression;
        const emotionConfidenceScore = expressions[maxExpression].toFixed(2);

        // Get Age and Gender
        const age = detection.age.toFixed(0); // Age value
        const gender = detection.gender; // Gender value
        const genderProbability = detection.genderProbability.toFixed(2); // Confidence for gender

        // Get the position of the bounding box
        const { x, y, width, height } = resizedDetections.detection.box;

        // Position the text outside the bounding box at the bottom right
        const textX = x + width + 10; // 10 pixels outside the bounding box to the right
        const textY = y + height + 20; // Bottom of the bounding box

        // Draw emotion and confidence outside the bounding box (in red)
        context.fillStyle = 'red';
        context.font = '16px Arial';
        context.fillText(`${finalEmotion} (${emotionConfidenceScore})`, textX, textY); 

        // Draw age and gender outside the bounding box (in green)
        context.fillStyle = 'green';
        context.fillText(`Age: ${age}`, textX, textY + 20); // Age below emotion
        context.fillText(`Gender: ${gender} (${genderProbability})`, textX, textY + 40); // Gender below age
    }
}

function startWebcam() {
    // Show the canvas and webcam element (if hidden)
    if (document.getElementById("webcam-container")) {
        document.getElementById("webcam-container").style.display = "block";
    }
    if (canvasElement) {
        canvasElement.style.display = "block";
    }

    // Start or reset the canvas for live feed
    if (!canvasElement) {
        canvasElement = document.createElement("canvas");
        canvasElement.width = 640;
        canvasElement.height = 480;
        document.getElementById("webcam-container").appendChild(canvasElement);
    } else {
        canvasElement.getContext('2d').clearRect(0, 0, canvasElement.width, canvasElement.height); 
    }

    // Reset or recreate the output canvas for final captured image
    if (!outputCanvasElement) {
        outputCanvasElement = document.createElement("canvas");
        outputCanvasElement.width = 640;
        outputCanvasElement.height = 480;
        document.getElementById("output-container").appendChild(outputCanvasElement);
    }

    canvasElement.style.position = "absolute";
    canvasElement.style.zIndex = "2";

    // Reinitialize the video element each time
    webcamElement = document.createElement("video");
    webcamElement.setAttribute("playsinline", true);
    webcamElement.setAttribute("autoplay", true);
    webcamElement.setAttribute("muted", true);
    webcamElement.setAttribute("width", 640);
    webcamElement.setAttribute("height", 480);
    document.getElementById("webcam-container").appendChild(webcamElement);

    navigator.mediaDevices.getUserMedia({ video: true }).then((mediaStream) => {
        stream = mediaStream;
        webcamElement.srcObject = stream;
        isWebcamRunning = true;
        startDetection();  // Restart the detection when the webcam starts again
    });
}

async function startDetection() {
    await loadModels(); 

    emotionLabel = document.getElementById("emotion-label");

    webcamElement.addEventListener("loadeddata", () => {
        if (isWebcamRunning) {
            detectionInterval = setInterval(detectFaceAndEmotion, 100);  // Detect every 100ms
        }
    });
}

function stopWebcam() {
    // Pause the video feed to freeze the last frame
    webcamElement.pause();

    // Stop detection loop
    clearInterval(detectionInterval);

    // Capture the final frame on the output canvas on the right side
    const contextOutput = outputCanvasElement.getContext('2d');
    contextOutput.clearRect(0, 0, outputCanvasElement.width, outputCanvasElement.height);
    contextOutput.drawImage(webcamElement, 0, 0, outputCanvasElement.width, outputCanvasElement.height); // Capture the last frame

    // Hide the live feed and canvas instead of removing them
    if (document.getElementById("webcam-container")) {
        document.getElementById("webcam-container").style.display = "none";
    }
    if (canvasElement) {
        canvasElement.style.display = "none";
    }

    // Draw the final bounding box and emotion score on the output canvas
    faceapi.detectSingleFace(webcamElement, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions().withAgeAndGender().then(detection => {
        if (detection) {
            const resizedDetections = faceapi.resizeResults(detection, {
                width: outputCanvasElement.width,
                height: outputCanvasElement.height,
            });

            faceapi.draw.drawDetections(outputCanvasElement, resizedDetections);

            const expressions = resizedDetections.expressions;
            const maxExpression = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
            const emotionConfidenceScore = expressions[maxExpression].toFixed(2);
            const age = detection.age.toFixed(0); // Age value
            const gender = detection.gender; // Gender value
            const genderProbability = detection.genderProbability.toFixed(2); // Confidence for gender

            // Get the position of the bounding box
            const { x, y, width, height } = resizedDetections.detection.box;

            // Position the text outside the bounding box at the bottom right
            const textX = x + width + 10; // 10 pixels outside the bounding box to the right
            const textY = y + height; // Bottom of the bounding box

            // Draw emotion and confidence outside the bounding box (in red)
            contextOutput.fillStyle = 'red';
            contextOutput.font = '16px Arial';
            contextOutput.fillText(`${maxExpression} (${emotionConfidenceScore})`, textX, textY); 

            // Draw age and gender outside the bounding box (in green)
            contextOutput.fillStyle = 'green';
            contextOutput.fillText(`Age: ${age}`, textX, textY + 20); // Age below emotion
            contextOutput.fillText(`Gender: ${gender} (${genderProbability})`, textX, textY + 40); // Gender below age
        }

        // Now stop the webcam stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        isWebcamRunning = false;

        // Remove the video element (live feed) only after final detection
        webcamElement.remove();
    });
}

document.getElementById("start-button").addEventListener("click", () => {
    if (!isWebcamRunning) {
        startWebcam();
        document.getElementById("start-button").style.display = "none";
        document.getElementById("stop-button").style.display = "inline";
    }
});

document.getElementById("stop-button").addEventListener("click", () => {
    if (isWebcamRunning) {
        stopWebcam();
        document.getElementById("start-button").style.display = "inline";
        document.getElementById("stop-button").style.display = "none";
    }
});
