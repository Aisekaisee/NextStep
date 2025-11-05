from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from parser import parse_resume
from recommender import recommend_careers


class ParsedResume(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: List[str] = []
    education: List[str] = []
    experience: List[str] = []


app = FastAPI(title="NextStep Resume Parser")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/parse", response_model=ParsedResume)
async def parse(file: UploadFile = File(...)):
    content = await file.read()
    result = await parse_resume(file.filename, content)
    return result


@app.post("/recommend")
async def recommend(file: UploadFile = File(...)):
    content = await file.read()
    parsed = await parse_resume(file.filename, content)
    recs = await recommend_careers(parsed)
    return {"parsed": parsed, **recs}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    """Single-call endpoint: upload resume -> get top roles directly."""
    content = await file.read()
    parsed = await parse_resume(file.filename, content)
    result = await recommend_careers(parsed)
    # Return only what the UI needs
    return {"recommendations": result.get("recommendations", [])}


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)


