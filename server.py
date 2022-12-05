import shutil
from typing import List
from fastapi import FastAPI, UploadFile, File
from tensorflow.keras.models import load_model
from skimage.transform import resize
import matplotlib.pyplot as plt
import numpy as np

def result(classification, predictions):
    first_element = np.flip(np.sort(predictions))[0][0]
    index = 0

    for z in predictions[0]:
        if z == first_element:
            break
        index += 1
    return classification[index]

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-image")
async def upload_image(img: UploadFile = File(...)):
    classification = ['airplane', 'automobile', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck']
    model = load_model('CNN_model.h5')

    with open(f'{img.filename}', 'wb') as buffer:
        shutil.copyfileobj(img.file, buffer)

    new_image = plt.imread(img.filename)
    img = plt.imshow(new_image)
    resized_image = resize(new_image, (32,32,3))
    predictions = model.predict(np.array( [resized_image] ))

    return {"result": result(classification, predictions)}
