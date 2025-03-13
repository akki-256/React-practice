from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORSの設定
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 返す内容を管理するグローバル変数
response_message = "まだ送信されていません"


# POST: 受信した内容を設定 (将来加工予定のため、messageを変数に保存)
@app.post("/")
async def receive_data(request: Request):
    global response_message
    try:
        data = await request.json()
        text = data.get("text", "").strip()

        if text:
            response_message = text  # ✅ 他のメソッドでもアクセス可能に
        else:
            response_message = "まだ送信されていません"

        return {"message": response_message}

    except Exception as e:
        response_message = "エラーが発生しました"
        return {"message": response_message, "error": str(e)}


# GET: 現在のresponse_messageを取得 (他メソッドからもアクセス可能)
@app.get("/message")
def get_current_message():
    return {"message": response_message}
