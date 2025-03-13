// import axios from "axios"
import { useState } from "react"

function App() {


  const [gettext, setGetText] = useState(null)
  const [setText, setSetText] = useState("ここに文字を入力")
  const url = "http://127.0.0.1:8000"

  const getMessage = async () => {
    try {
      const res = await fetch(url);
      const result = await res.json();
      setGetText(result.message);
    } catch (error) {
      console.error('Error:', error);
      setResponse('通信エラーが発生しました');
    }
  };

  // const getTextbypy = () => {
  //   axios.get(url).then((res) => {
  //     setGetText(res.data)
  //   })
  // }


  return (
    <>
      {text ? <div>{text?.Hello}</div> : <button onClick={getTextbypy}>データを取得</button>}
      <input type="text" value={setText} onChange={(event) => { setSetText(event.target.value) }} />
      <button onClick={sentText}>送信</button>
    </>
  )
}

export default App
