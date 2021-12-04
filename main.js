const video = document.querySelector('#video');
let text = document.querySelector('#text');
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models/"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models/"),
    faceapi.nets.ageGenderNet.loadFromUri("/models/")
]).then(startVideo)

// function startVideo() {
//     navigator.getUserMedia(
//         { video: {} },
//         stream => {
//             video.srcObject = stream;
//         },
//         err => console.error(err)
//     )
// }
async function startVideo() {
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;    /* use the stream */
       
    } catch (err) {
        console.error(err)  /* handle the error */
    }
}
video.addEventListener("playing", () => {
    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions()
            .withAgeAndGender();
        if(detections[0]){
            document.querySelector('#info').classList.remove("hidden");
            document.querySelector('#absence').classList.add("hidden");
            let mood = detections[0]?.expressions;
            for (let prop in mood) {
                if (mood[prop] > 0.8) {
                    mood = prop
                    document.querySelector('#emotion').innerHTML = mood;
                    switch (mood) {
                        case "neutral":
                            document.querySelector('#emoji').innerHTML = `😐`;
                            break;
                        case "disgusted":
                            document.querySelector('#emoji').innerHTML = `🤮`;
                            break;
                        case "fearful":
                            document.querySelector('#emoji').innerHTML = `😨`;
                            break;
                        case "happy":
                            document.querySelector('#emoji').innerHTML = `😄`;
                            break;
                        case "angry":
                            document.querySelector('#emoji').innerHTML = `😡`;
                            break;
                        case "sad":
                            document.querySelector('#emoji').innerHTML = `😔`;
                            break;
                        case "surprised":
                            document.querySelector('#emoji').innerHTML = `😮`;
                            break;
                        default:
                            document.querySelector('#emoji').innerHTML = `👀`;
                    }            
                }
            }
            if (detections[0]?.genderProbability > 0.85) {
                document.querySelector('#gender').innerHTML = detections[0].gender;
            }
            if(Math.round(detections[0]?.age)){
                document.querySelector('#age').innerHTML = Math.round(detections[0]?.age);
            }
        }else{
            document.querySelector('#info').classList.add("hidden");
            document.querySelector('#absence').classList.remove("hidden");
        }
        // console.log( detections[0])

    }, 500)
})

