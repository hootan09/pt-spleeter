
from fastapi import Request, FastAPI
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import torch
from web.config import settings

import os
import sys
from pathlib import Path
sys.path.append("..") # for importing modules from parent directory 

from splitter import Splitter
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
# Loading model
model_path: str = "models/2stems/model.pt"
model = Splitter.from_pretrained(model_path).to(device).eval()


app = FastAPI(title=settings.PROJECT_NAME,version=settings.PROJECT_VERSION)

app.mount("/output", StaticFiles(directory="output",check_dir=True, html=True), name="output")
templates = Jinja2Templates(directory="output")


@app.get("/output", response_class=HTMLResponse)
def list_files(request: Request):

    files = os.listdir("output")
    files_paths = sorted([f"{request.url._url}/{f}" for f in files if f != "index.html"])
    return templates.TemplateResponse(
        "index.html", {"request": request, "files": files_paths}
    )

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

@app.get("/split")
async def split():
    input: str = "input/1.mp3"
    output_dir: str = "output"
    offset: float = 0
    duration: float = 30
    write_src: bool = False

    import librosa
    import soundfile


    sr = 44100

    # load wav audio
    fpath_src = Path(input)
    wav, _ = librosa.load(
        fpath_src,
        mono=False,
        res_type="kaiser_fast",
        sr=sr,
        duration=duration,
        offset=offset,
    )
    wav = torch.Tensor(wav).to(device)

    # normalize audio
    # wav_torch = wav / (wav.max() + 1e-8)

    with torch.no_grad():
        stems = model.separate(wav)

    if write_src:
        stems["input"] = wav
    for name, stem in stems.items():
        fpath_dst = Path(output_dir) / f"{fpath_src.stem}_{name}.wav"
        print(f"Writing {fpath_dst}")
        fpath_dst.parent.mkdir(exist_ok=True)
        soundfile.write(fpath_dst, stem.cpu().detach().numpy().T, sr, "PCM_16")
        # write_wav(fname, np.asfortranarray(stem.squeeze().numpy()), sr)
    response = RedirectResponse(url='/output')
    return response


# @app.post("/predict")
# async def inference(request: Request):
#     input = request.json()
#     prediction = model.predict(input)
#     return {"predictions": predictions}