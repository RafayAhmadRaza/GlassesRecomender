
import { FaceLandmarker,FilesetResolver } from "@mediapipe/tasks-vision";




const uploadButton = document.getElementById("Upload");
const webcamButton = document.getElementById("webcam");
const fileOpener = document.getElementById("fileopener");
const imageElement = document.getElementById("imageElement");
const canvas = document.getElementById("display");
const averageRatios = {
  "Heart": 1.31330,
  "Oblong": 1.20209,
  "Oval": 0.94252,
  "Round": 1.41366,
  "Square": 1.13363
};


let videoElement = document.getElementById("videoElement");
let isOnwebcam = false;
let image;
let glassesTypes = [];


let faceLandmarker;
let landmarks;

uploadButton.addEventListener("click",uploadImage);
webcamButton.addEventListener("click",startwebcam);


async function loadMODEL() {
  const MODEL_URL = '/models/face_landmarker.task';
  const vision = await FilesetResolver.forVisionTasks(// path/to/wasm/root
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);
faceLandmarker = await FaceLandmarker.createFromOptions(
vision,
{
  baseOptions:{
    modelAssetPath:MODEL_URL,
    delegate:"CPU"
  },
  outputFaceBlendshapes:false,
  runningMode:"IMAGE",
  numFaces: 1
});
console.log("Facelandmarker MODEL LOADED");

}

function findClosetShape(inputRatio)
{
  let closestShape = null;

  let smallestDiff = Infinity;

  for(const shape in averageRatios){
    const diff = Math.abs(averageRatios[shape] - inputRatio);
    if(diff<smallestDiff){
    smallestDiff = diff;
    closestShape = shape;
  }
  }

  return closestShape;

}
function debugPrinter(){
    console.log("Hello Vorld");
}

async function FaceTypeDetector(image){
  
  const faceLandmarkerResult = await faceLandmarker.detect(image);


  
  landmarks = faceLandmarkerResult["faceLandmarks"];

  console.log(landmarks);

  const points = landmarks[0]

  let forehead = points[151]; //forehead center
  let chin = points[152]; //chin
  let Rightcheekbone = points[234]; //left cheekbone
  let Leftcheekbone = points[454]; //right cheekbone


  console.log("Forehead: ",forehead);
  console.log("Chin: ",chin);
  console.log("RightCheek: ",Rightcheekbone);
  console.log("LeftCheek: ",Leftcheekbone);
  


  const width = distance(Leftcheekbone,Rightcheekbone);
  console.log("width: " + width);


  const height = distance(forehead,chin);

  console.log("height: " + height);

  const aspectRatio = width/height;

  console.log("Aspect Ratio: " + aspectRatio);

  let faceType = findClosetShape(aspectRatio);

  
  console.log("Face Shape: " + faceType);

  document.getElementById("Facetype").innerHTML = faceType;

 

}


function startwebcam(){
  document.getElementById("Facetype").innerHTML = "";

  imageElement.removeAttribute("src");
  imageElement.height = 0;
  imageElement.width = 0; 
  document.getElementById("StartBTN").style.display = 'block';
  if (navigator.mediaDevices.getUserMedia && !isOnwebcam) 
    {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
          videoElement.play();
          isOnwebcam = true;
          document.getElementById("StartBTN").addEventListener("click",() => {

            FaceTypeDetector(videoElement);
          });




        };
      })
      .catch(function (error) {
        console.log("something went wrong", error);
      });
  } else {
    console.log("getUserMedia not supported");
  }
}

function uploadImage()
{
  document.getElementById("Facetype").innerHTML = "";
  

    if(isOnwebcam && videoElement.srcObject){
        videoElement.style.zIndex = 0;
    document.getElementById("StartBTN").style.display = 'none';

           
        let tracks = videoElement.srcObject.getTracks();


        tracks.forEach(track => track.stop());
        
        videoElement.srcObject = null;
        
        isOnwebcam = false

            
        
    }
 
    fileOpener.click();

    
    
  }
  
  
  
      fileOpener.onchange = () =>{
        
        image = fileOpener.files[0];
        
  
        
        let objURL = URL.createObjectURL(image);
        
        
        imageElement.src = objURL;
        imageElement.height = canvas.clientHeight-2;
        
        imageElement.width = canvas.clientWidth-3;
        
        imageElement.onload = async () => {
        
        fileOpener.value = null;
        
        
        FaceTypeDetector(imageElement);
      
      
      }


  
  
      }

loadMODEL();

function distance(point1, point2){
  return Math.sqrt(
    Math.pow(point2.x-point1.x,2) + Math.pow(point2.y-point1.y,2)
  )
}