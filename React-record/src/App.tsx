import "regenerator-runtime";
import React, { useState, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>ブラウザが音声認識未対応です</span>;
  }

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      audioChunks.current = [];
    };
    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold mb-4">録音アプリ</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 disabled:bg-gray-400"
        onClick={startRecording}
        disabled={recording}
      >
        録音開始
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        onClick={stopRecording}
        disabled={!recording}
      >
        録音停止
      </button>
      {audioURL && (
        <div className="mt-4">
          <audio controls src={audioURL}></audio>
        </div>
      )}
      <div>
        webSpeechApi
      </div>
      <p>入力: {listening ? "on" : "off"}</p>
      <button type="button" onClick={() => SpeechRecognition.startListening()}>
        入力開始
      </button>
      <button type="button" onClick={() => SpeechRecognition.stopListening()}>
        Stop
      </button>
      <button type="button" onClick={() => resetTranscript()}>
        リセット
      </button>
      <p>{transcript}</p>
    </div>
  );
};

export default AudioRecorder;
