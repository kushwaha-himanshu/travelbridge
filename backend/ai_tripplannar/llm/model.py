import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()
your_api_key = os.getenv("GEMINI_API_KEY")
llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    temperature=0.2,
    google_api_key=your_api_key,
)

