import "regenerator-runtime";
import React, { useState, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false); //録音状態
  const [audioURL, setAudioURL] = useState<string | null>(null);//録音ファイル格納url
  const mediaRecorder = useRef<MediaRecorder | null>(null);//メディアレコーダ
  const audioChunks = useRef<Blob[]>([]);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();//音声テキスト化API

  if (!browserSupportsSpeechRecognition) {
    return <span>ブラウザが音声認識未対応です</span>;//Firefox等APIが利用できない場合文字列のみを表示
  }

  //録音開始ボタン押した時の挙動
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });//マイクの使用許可、マイクの音声入力を取得
    mediaRecorder.current = new MediaRecorder(stream);//録音を管理するオブジェクトのインスタンスを作成
    mediaRecorder.current.ondataavailable = (event) => {//録音データが利用可能になるたび
      audioChunks.current.push(event.data);//録音データを配列 audioChunks に蓄積
    };
    //録音が終了したときの挙動の定義
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });//audioChunksに蓄積された録音データをwavに変換
      const url = URL.createObjectURL(audioBlob);//録音データ(wav)を再生可能なURLに変換↓保存
      setAudioURL(url);
      audioChunks.current = [];//蓄積したデータを初期化
    };
    mediaRecorder.current.start();//実際にはここで録音開始
    setRecording(true);//録音状態を有効に変更(ボタンの変化などに用いる)
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
