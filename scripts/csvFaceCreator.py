import os
import math
import mediapipe.python.solutions.face_mesh as mp_face
import pandas as pd
import cv2 as cv



def distance(p1,p2):
 return math.sqrt(
  math.pow(p2.x-p1.x,2) + math.pow(p2.y-p1.y,2)
 )

def createCSV(filename,data,output_dir="."):

    os.chdir("../")
    os.chdir("../")


    filepath = os.path.join(output_dir,filename + ".csv")
    
    
    df = pd.DataFrame(data)
    
    df.to_csv(filepath,index=False)


def createLists(PathList,itemList,url):

    os.chdir(url)

    for name in os.listdir(os.getcwd()):
        PathList.append(os.getcwd()+ "\\" + name)


    for name in PathList:
        os.chdir(name)
        for name in os.listdir(os.getcwd()):
            itemList.append(os.getcwd() + "\\" + name)

def faceLandmarks(image):
     faceResult = face.process(cv.cvtColor(image,cv.COLOR_BGR2RGB))
     if faceResult.multi_face_landmarks:
        landmarks = faceResult.multi_face_landmarks[0]

        return landmarks
     return None

def processImages(itemList,facetypes):
    aspect_ratio_list=[]

    width_list=[]

    height_list=[]

    current_folder_list=[]

    eye_spacing_list = []

    for url in itemList:
        image = cv.imread(url)

        

        # print("Processing")

        for f in facetypes:
            if f in url:
                current_folder = f
                break
        else:
            continue

        landmarks = faceLandmarks(image)

        if landmarks is None:
            continue
    
        forehead = landmarks.landmark[151] #forehead
        chin = landmarks.landmark[152] #chin
        left_cheek = landmarks.landmark[234] #left cheek
        right_cheek = landmarks.landmark[454] #right cheek
        left_eye = landmarks.landmark[362]
        right_eye = landmarks.landmark[133]



        width = distance(left_cheek,right_cheek)

        # print(width)

        height = distance(forehead,chin)

        eye_spacing = distance(left_eye,right_eye)
        # print(height)


        aspectRatio = width/height


        # print(aspectRatio)

        aspect_ratio_list.append(aspectRatio)
        width_list.append(width)
        height_list.append(height)
        current_folder_list.append(current_folder)
        eye_spacing_list.append(eye_spacing)




    return {
            "aspect_ratio":aspect_ratio_list,
            "width":width_list,
            "height":height_list,
            "eye_spacing":eye_spacing_list,
            "label":current_folder_list
        
            }
    


if __name__ == "__main__":
   
    face = mp_face.FaceMesh(
        static_image_mode=True,
        max_num_faces=1,
    )

    faceDIRS = r"public/FaceTypes"
    
    filename = 'faceDataSource'
    selected_indices = [151,152,234,454]

    PathList = []

    data={}


    itemList = []

    facetypes = ["heart","oblong","oval","round","square"]

    createLists(PathList,itemList,faceDIRS)

    
    data = processImages(itemList,facetypes)



    
    createCSV("facedatasource",data)

    print("Done")
