const video = document.querySelector('#video');
let text = document.querySelector('#text');
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models/"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models/"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models/"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models/"),
    faceapi.nets.ageGenderNet.loadFromUri("/models/")
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => {
            video.srcObject = stream;
        },
        err => console.error(err)
    )
}

video.addEventListener("playing", () => {
    // const canvas = faceapi.createCanvasFromMedia(video)
    // document.body.append(canvas)
    // const displaySize = { width: video.width, height: video.height }
    // faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            // .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender();
   
        let mood = detections[0]?.expressions;
        for (let prop in mood) {
            if (mood[prop] > 0.8) {
                mood = prop
                document.querySelector('#emotion').innerHTML = mood;
            }
        }
        document.querySelector('#age').innerHTML = Math.round(detections[0].age);
        if (detections[0]?.genderProbability > 0.85) {
            document.querySelector('#gender').innerHTML = detections[0].gender;
        }
        console.log(mood, detections[0])

        // const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
        // faceapi.draw.drawDetections(canvas, resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections, 0.05) //minProbability = 0.05
    
    }, 1000)
})

