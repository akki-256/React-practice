import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const home = () => {
    const { inputString, setInputString } = useState('')

    const {

    } = use

    // const startRecording = async () => {
    //     try {
    //         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    //         mediaRecorder.current = new MediaRecorder(stream);

    //         mediaRecorder.current.ondataavailable = (event) => {
    //             audioChunks.current.push(event.data);
    //         };

    //         mediaRecorder.current.onstop = async () => {
    //             const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
    //             const formData = new FormData();
    //             formData.append("audio", audioBlob, "recording.wav");

    //             const response = await fetch("http://localhost:5000/transcribe", {
    //                 method: "POST",
    //                 body: formData,
    //             });

    //             const result = await response.json();
    //             console.log("変換結果:", result.text);
    //         };

    //         mediaRecorder.current.start();
    //         setRecording(true);
    //     } catch (error) {
    //         console.error("録音の開始に失敗:", error);
    //     }
    // };

    return (
        <div>
            <button>録音開始</button>
            <div>テキスト化結果</div>
            <div>{inputString}</div>
        </div>
    )
}

export default home