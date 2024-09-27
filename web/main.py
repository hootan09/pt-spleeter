
from fastapi import Request, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
# from fastapi.templating import Jinja2Templates
import torch
from web.config import settings
import sys
import numpy as np
from pathlib import Path
sys.path.append("..") # for importing modules from parent directory 

from splitter import Splitter
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
# Loading model
model_path: str = "models/2stems/model.pt"
model = Splitter.from_pretrained(model_path).to(device).eval()


app = FastAPI(title=settings.PROJECT_NAME,version=settings.PROJECT_VERSION)
app.add_middleware(
  CORSMiddleware,
  allow_origins=settings.ORIGINS,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)
app.mount("/output/", StaticFiles(directory="output",check_dir=True), name="output")
app.mount("/streamplayer", StaticFiles(directory="streamplayer"), name="streamplayer")

#templates = Jinja2Templates(directory="streamplayer")

# @app.get("/output", response_class=HTMLResponse)
# def list_files(request: Request):
#     files = os.listdir("output")
#     files_paths = sorted([f"{request.url._url}/{f}" for f in files if f != "index.html"])
#     return templates.TemplateResponse("index.html", {"request": request, "files": files_paths})

@app.get("/")
def hello_api():
    return {"msg":"Hello FastAPI🚀"}

@app.get("/test_model")
async def test_model():
    from unet import UNet
    batch_size = 5
    n_channels = 2
    x = torch.randn(batch_size, n_channels, 512, 128)
    net = UNet(in_channels=n_channels)
    y = net.forward(x)
    return {
        # "model": str(net),
        "x_shape": str(x.shape),
        "y_shape": str(y.shape)
    }

# @app.get("/split")
# async def split():
#     input: str = "input/1.mp3"
#     output_dir: str = "output"
#     offset: float = 0
#     duration: float = 30
#     write_src: bool = False

#     import librosa
#     import soundfile
#     sr = 44100

#     # load wav audio
#     fpath_src = Path(input)
#     wav, _ = librosa.load(
#         fpath_src,
#         mono=False,
#         res_type="kaiser_fast",
#         sr=sr,
#         duration=duration,
#         offset=offset,
#     )
#     wav = torch.Tensor(wav).to(device)

#     # normalize audio
#     # wav_torch = wav / (wav.max() + 1e-8)

#     with torch.no_grad():
#         stems = model.separate(wav)

#     if write_src:
#         stems["input"] = wav
#     for name, stem in stems.items():
#         fpath_dst = Path(output_dir) / f"{fpath_src.stem}_{name}.wav"
#         print(f"Writing {fpath_dst}")
#         fpath_dst.parent.mkdir(exist_ok=True)
#         soundfile.write(fpath_dst, stem.cpu().detach().numpy().T, sr, "PCM_16")
        
#     response = RedirectResponse(url='/output')
#     return response

@app.get("/splitmp3/{item_name}")
async def splitmp3(item_name):
    input: str = "input/" + item_name
    output_dir: str = "output"
    offset: float = 0
    duration: float = 30
    write_src: bool = False

    import librosa
    from pydub import AudioSegment
    import tempfile
    import soundfile
    sr = 44100

    # load wav audio
    fpath_src = Path(input)
    wav, _ = librosa.load(
        fpath_src,
        mono=False,
        res_type="kaiser_fast",
        sr=settings.SAMPLE_RATE,
        duration=duration,
        offset=offset,
    )
    wav = torch.Tensor(wav).to(device)

    with torch.no_grad():
        stems = model.separate(wav)

    if write_src:
        stems["input"] = wav
    for name, stem in stems.items():
        fpath_dst = Path(output_dir) / f"{fpath_src.stem}_{name}.mp3"
        fpath_dst.parent.mkdir(exist_ok=True)

        tmp_file = tempfile.NamedTemporaryFile(suffix='.wav')
        soundfile.write(tmp_file, stem.cpu().detach().numpy().T, sr, "PCM_16")
        tmp_file.seek(0)  # Reset the file pointer

        audio = AudioSegment.from_wav(tmp_file)
        data = np.array(audio.get_array_of_samples())
        data = data.reshape(audio.channels, -1, order='C')
        # print("Shape of the converted numpy array:", data.shape , audio.channels, audio.frame_rate)
        audio_segment = AudioSegment(data.tobytes(), frame_rate= settings.SAMPLE_RATE, sample_width=data.dtype.itemsize, channels=audio.channels)
        audio_segment.export(Path(output_dir) / f"{fpath_src.stem}_{name}.mp3", format='mp3')
    return RedirectResponse(url='/streamplayer/index.html?pl=' + item_name.rsplit('.', 1)[0])



# @app.get("/upload")
# async def main():
#     content = """
#     <body>
#     <form action="/files/" enctype="multipart/form-data" method="post">
#     <input name="files" type="file" multiple>
#     <input type="submit">
#     </form>
#     <form action="/uploadfile/" enctype="multipart/form-data" method="post">
#     <input name="file" type="file" accept="audio/mp3">
#     <input type="submit">
#     </form>
#     </body>
#     """
#     return HTMLResponse(content=content)


#https://github.com/Danny-Dasilva/FastAPI-Hosting/blob/master/main.py

# @app.post("/predict")
# async def inference(request: Request):
#     input = request.json()
#     prediction = model.predict(input)
#     return {"predictions": predictions}