
import { FaceLandmarker,FilesetResolver } from "@mediapipe/tasks-vision";




const uploadButton = document.getElementById("Upload");
const webcamButton = document.getElementById("webcam");
const fileOpener = document.getElementById("fileopener");
const imageElement = document.getElementById("imageElement");
const canvas = document.getElementById("display");


let videoElement = document.getElementById("videoElement");
let isOnwebcam = false;
let image;
let glassesTypes = [];
let faceTypes = [];
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


function debugPrinter(){
    console.log("Hello Vorld");
}

async function FaceTypeDetector(image){
  
  const faceLandmarkerResult = await faceLandmarker.detect(image);


  
  landmarks = faceLandmarkerResult["faceLandmarks"];

  console.log(landmarks);
  let forehead = landmarks[0][10]; //forehead center
  let chin = landmarks[0][152]; //chin
  let Leftcheekbone = landmarks[0][352]; //right cheekbone
  let Rightcheekbone = landmarks[0][50]; //left cheekbone


  let facewidthX = Math.abs(Leftcheekbone.x-Rightcheekbone.x); 
  let facewidthY = Math.abs(Leftcheekbone.y-Rightcheekbone.y); 

  let faceheightX = Math.abs(forehead.x-chin.x);
  let faceheightY = Math.abs(forehead.y-chin.y);



  console.log("Face width X: " + facewidthX);
  console.log("Face width Y: " +facewidthY);
  console.log("Face Height X: " +faceheightX);
  console.log("Face Height Y: " +faceheightY);


  let Facewidth = facewidthX+facewidthY;
  let Faceheight = faceheightX + faceheightY;
  let aspectRatio = Facewidth/Faceheight;


  console.log("Face width: " + Facewidth);
  console.log("Face Height: " + Faceheight);
  console.log("Aspect Ratio: " + aspectRatio);




 

}

function startwebcam(){

  imageElement.removeAttribute("src");
  imageElement.height = 0;
  imageElement.width = 0; 
  if (navigator.mediaDevices.getUserMedia && !isOnwebcam) 
    {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
          videoElement.play();
          isOnwebcam = true;

          FaceTypeDetector(video);



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

    if(isOnwebcam && videoElement.srcObject){
        videoElement.style.zIndex = 0;
           
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