let model
let videoWidth, videoHeight
let ctx, canvas
const log = document.querySelector("#array")
const VIDEO_WIDTH = 720
const VIDEO_HEIGHT = 405
//import * as knn from '@tensorflow-models/knn-classifier';
//const numArray = []; 

const k = 3
const KNN = new kNear(k)
let stop_vuist=true
let stop_vijf=true



//
// start de applicatie
//
async function main() {
   
        model = await handpose.load()
        const video = await setupCamera()
        video.play()
        console.log(stop)
        startLandmarkDetection(video)   
}

//
// start de webcam
//
async function setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
            "Webcam not available"
        )
    }

    const video = document.getElementById("video")
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            facingMode: "environment",
            width: VIDEO_WIDTH,
            height: VIDEO_HEIGHT
        }
    })
    video.srcObject = stream

    return new Promise(resolve => {
        video.onloadedmetadata = () => {
            resolve(video)
        }
    })
}

//
// predict de vinger posities in de video stream
//
async function startLandmarkDetection(video) {

    videoWidth = video.videoWidth
    videoHeight = video.videoHeight

    canvas = document.getElementById("output")

    canvas.width = videoWidth
    canvas.height = videoHeight

    ctx = canvas.getContext("2d")

    video.width = videoWidth
    video.height = videoHeight

    ctx.clearRect(0, 0, videoWidth, videoHeight)
    ctx.strokeStyle = "red"
    ctx.fillStyle = "red"

    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1) // video omdraaien omdat webcam in spiegelbeeld is

//new
$("#vuist").click(function(){
    stop_vijf=true
    stop_vuist=false
    $("#state").html("Wait 3 seconds")
    setTimeout(function(){
        trainvuist()
        $("#state").html("VUIST training")
    },3000)
   
    

})

$("#vijf_vingers").click(function(){
    stop_vijf=false
    stop_vuist=true
    $("#state").html("Wait 3 seconds")
  
    setTimeout(function(){
        trainvijf()
        $("#state").html("VIJF VINGERS training")
    },3000)
    

})

$("#predict").click(function(){
    stop_vijf=true
    stop_vuist=true
    $("#state").html("Prediction")
    predictLandmarks()
    

})
    // document.onkeypress = function (e) {
    //     e = e || window.event;
    //     console.log(e.key)
    //     if (e.key=="v") {
    //         // KNN.learn([landmark[0], landmark[1], landmark[2]], "Vuist")
    //         // console.log("training........")
    //         stop_train=false
    //         trainvuist()
    //     }

    //     else if (e.key=="h") {
    //         stop_train=false
    //         trainhelehand()
    //     }
    //     else if (e.key=="c") {
    //         $("#state").html("Prediction")
    //         stop_train=true;
    //         predictLandmarks()
           
    //     }
    //     else if (e.key=="s") {
    //         $("#state").html("Stop training")
    //         stop_train=true;
            
           
           
    //     }
    //     };
        //new





   


    
}

//
// predict de locatie van de vingers met het model
//
async function trainvuist() {
    console.log("vuist training")
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight, 0, 0, canvas.width, canvas.height)
    // prediction!
    const predictions = await model.estimateHands(video) // ,true voor flip
    const numArray = []; //new

    if (predictions.length > 0) {
     //new
     predictions.forEach((prediction) => {
        prediction.landmarks.forEach((landmark) => {
            KNN.learn([landmark[0], landmark[1], landmark[2]], "vuist")
            $("#state").html("VUIST training")
        
        
            

          
         //console.log(landmark)
        //   numArray.push(landmark[0]);
        //   numArray.push(landmark[1]);
        //   numArray.push(landmark[2]);
          

     
          

           
        });
      });
      

     //new

        //console.log(predictions)
        drawHand(ctx, predictions[0].landmarks, predictions[0].annotations)
    }

    //console.log(numArray)//new
    // 60 keer per seconde is veel, gebruik setTimeout om minder vaak te predicten
    
    if (stop_vuist==false){
        requestAnimationFrame(trainvuist) 
    }
    
   
    
    // setTimeout(()=>predictLandmarks(), 1000)
}




///////
async function trainvijf() {
    console.log("vijf vingers training")
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight, 0, 0, canvas.width, canvas.height)
    // prediction!
    const predictions = await model.estimateHands(video) // ,true voor flip
    const numArray = []; //new

    if (predictions.length > 0) {
     //new
     predictions.forEach((prediction) => {
        prediction.landmarks.forEach((landmark) => {
        
        if (stop_vijf==false){
            KNN.learn([landmark[0], landmark[1], landmark[2]], "Vijf Vingers")
            $("#state").html("VIJF VINGERS training")
        }  
        
            

          
         //console.log(landmark)
        //   numArray.push(landmark[0]);
        //   numArray.push(landmark[1]);
        //   numArray.push(landmark[2]);
          

     
          

           
        });
      });
      

     //new

        //console.log(predictions)
        drawHand(ctx, predictions[0].landmarks, predictions[0].annotations)
    }

    //console.log(numArray)//new
    // 60 keer per seconde is veel, gebruik setTimeout om minder vaak te predicten
    if (stop_vijf==false){
        requestAnimationFrame(trainvijf)
    }
    
   
    
    // setTimeout(()=>predictLandmarks(), 1000)
}
////////////////////////////////////////////////

async function predictLandmarks() {
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight, 0, 0, canvas.width, canvas.height)
    // prediction!
    const predictions = await model.estimateHands(video) // ,true voor flip
    const numArray = []; //new

    if (predictions.length > 0) {
     //new
     predictions.forEach((prediction) => {
        prediction.landmarks.forEach((landmark) => {
        let prediction = KNN.classify([landmark[0], landmark[1], landmark[2]])
        //console.log(`I think this is  ${prediction}`)  
        if (prediction=="Vijf Vingers"){
            $("#result").html(prediction+ " 🖐️") 
        }

        if (prediction=="vuist"){
            $("#result").html(prediction+ " ✊") 
        }
        
           
         //console.log(landmark)
        //   numArray.push(landmark[0]);
        //   numArray.push(landmark[1]);
        //   numArray.push(landmark[2]);
          

     
          

           
        });
      });
      

     //new

        //console.log(predictions)
        drawHand(ctx, predictions[0].landmarks, predictions[0].annotations)
    }

    //console.log(numArray)//new
    // 60 keer per seconde is veel, gebruik setTimeout om minder vaak te predicten
    requestAnimationFrame(predictLandmarks)
    // setTimeout(()=>predictLandmarks(), 1000)
}

















//new
// async function train(){
//     const classifier = knnClassifier.create();
//    if(numArray.length>0){
//     console.log(numArray)
//     classifier.addExample(numArray, 'peace');
//     classifier.addExample(numArray, 'thumbs up');
//    }
   
// }

// train()



async function predictPose() {
    const  predictions = await model.estimateHands(video);
    // const numbers = convertHandPoseToNumbers(predictions);
    const result = await classifier.predictClass(numArray);
    console.log(result.label);
  }






//new

//
// teken hand en vingers met de x,y coordinaten. de z waarde tekenen we niet.
//
function drawHand(ctx, keypoints, annotations) {
    // toon alle x,y,z punten van de hele hand in het log venster
    //log.innerText = keypoints.flat()
    //console.log(keypoints.flat())

    // punten op alle kootjes kan je rechtstreeks uit keypoints halen 
    for (let i = 0; i < keypoints.length; i++) {
        const y = keypoints[i][0]
        const x = keypoints[i][1]
        drawPoint(ctx, x - 2, y - 2, 3)
    }

    // palmbase als laatste punt toevoegen aan elke vinger
    let palmBase = annotations.palmBase[0]
    for (let key in annotations) {
        const finger = annotations[key]
        finger.unshift(palmBase)
        drawPath(ctx, finger, false)
    }
}

//
// teken een punt
//
function drawPoint(ctx, y, x, r) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fill()
}
//
// teken een lijn
//
function drawPath(ctx, points, closePath) {
    const region = new Path2D()
    region.moveTo(points[0][0], points[0][1])
    for (let i = 1; i < points.length; i++) {
        const point = points[i]
        region.lineTo(point[0], point[1])
    }

    if (closePath) {
        region.closePath()
    }
    ctx.stroke(region)
}

//
// start
//
main()