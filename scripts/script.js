
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



uploadButton.addEventListener("click",uploadImage);
webcamButton.addEventListener("click",startwebcam);





function debugPrinter(){
    console.log("Hello Vorld");
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
        
        fileOpener.value = null;
  
  
      }
      