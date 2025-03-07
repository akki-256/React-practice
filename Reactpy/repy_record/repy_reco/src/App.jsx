import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [isSleeping, setIsSleeping] = useState(false);
  const router = useRouter();
  let mediaRecorder;

  useEffect(() => {
    if (isSleeping) {
      router.push("/t/");
    }
  }, [isSleeping, router]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/wav" });
      setAudioBlob(blob);
      sendAudio(blob);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const sendAudio = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "audio.wav");

    const response = await fetch("http://localhost:8000/process_audio", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setTranscript(data.text);
    setIsSleeping(data.isSleeping);
  };

  return (
    <div>
      <h1>音声録音アプリ</h1>
      <button onClick={startRecording} disabled={recording}>録音開始</button>
      <button onClick={stopRecording} disabled={!recording}>録音停止</button>
      <div>
        <h2>音声テキスト</h2>
        <div>{transcript}</div>
      </div>
    </div>
  );
}
