const video = document.querySelector('#video');
let text = document.querySelector('#text');
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models/"),
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
    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions()
            .withAgeAndGender();
   
        let mood = detections[0]?.expressions;
        for (let prop in mood) {
            if (mood[prop] > 0.8) {
                mood = prop
                document.querySelector('#emotion').innerHTML = mood;
            }
        }
        document.querySelector('#age').innerHTML = Math.round(detections[0]?.age);
        if (detections[0]?.genderProbability > 0.85) {
            document.querySelector('#gender').innerHTML = detections[0].gender;
        }
        console.log(mood, detections[0])

    }, 1000)
})

