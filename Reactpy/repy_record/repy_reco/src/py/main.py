from fastapi import FastAPI, File, UploadFile
import speech_recognition as sr
from pydantic import BaseModel
import io
import numpy as np
import wave

app = FastAPI()

class AudioResponse(BaseModel):
    text: str
    isSleeping: bool

def analyze_audio(audio_data: np.ndarray) -> bool:
    # 簡単な睡眠判定: 音の大きさが一定以下なら睡眠と判定
    return np.mean(np.abs(audio_data)) < 0.01

@app.post("/process_audio", response_model=AudioResponse)
async def process_audio(file: UploadFile = File(...)):
    recognizer = sr.Recognizer()
    audio_data = await file.read()
    
    with wave.open(io.BytesIO(audio_data), "rb") as wav_file:
        frames = wav_file.readframes(wav_file.getnframes())
        audio_array = np.frombuffer(frames, dtype=np.int16)
    
    try:
        with sr.AudioFile(io.BytesIO(audio_data)) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio, language="ja-JP")
    except sr.UnknownValueError:
        text = "認識できませんでした"
    except sr.RequestError:
        text = "音声認識サービスに接続できませんでした"
    
    is_sleeping = analyze_audio(audio_array)
    return {"text": text, "isSleeping": is_sleeping}