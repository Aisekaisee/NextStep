import io
import os
import re
from typing import Dict, List, Optional
import json

from pypdf import PdfReader
from docx import Document  # type: ignore

from langchain_core.prompts import ChatPromptTemplate

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    _HAS_GEMINI = True
except Exception:
    _HAS_GEMINI = False


def _extract_text_from_pdf(bytes_data: bytes) -> str:
    """Extract text from PDF bytes."""
    reader = PdfReader(io.BytesIO(bytes_data))
    text_parts: List[str] = []
    for page in reader.pages:
        text_parts.append(page.extract_text() or "")
    return "\n".join(text_parts)


def _extract_text_from_docx(bytes_data: bytes) -> str:
    """Extract text from DOCX bytes."""
    file_like = io.BytesIO(bytes_data)
    doc = Document(file_like)
    return "\n".join(p.text for p in doc.paragraphs)


def _basic_regex_skills(text: str) -> List[str]:
    """Extract skills using basic regex patterns."""
    keywords = [
        "python", "javascript", "typescript", "react", "node", "java", "c++",
        "sql", "mongodb", "aws", "azure", "gcp", "docker", "kubernetes",
        "data analysis", "machine learning", "nlp", "pandas", "numpy",
        "flask", "django", "fastapi", "vue", "angular", "express",
        "pytorch", "tensorflow", "scikit-learn", "git", "github",
    ]
    found = set()
    lower = text.lower()
    for k in keywords:
        if k in lower:
            found.add(k)
    return sorted(found)


def _extract_json_from_markdown(text: str) -> str:
    """Extract JSON from markdown code blocks if present."""
    if not text or not text.strip():
        return "{}"
    
    # Pattern to match code blocks with optional json tag
    pattern = r'``````'
    match = re.search(pattern, text)
    if match:
        return match.group(1).strip()
    
    # Return as-is if no code block found
    return text.strip()


async def parse_resume(filename: str, bytes_data: bytes) -> Dict:
    """
    Parse resume from PDF, DOCX, or text file using LLM.
    
    Args:
        filename: Name of the file
        bytes_data: File content as bytes
        
    Returns:
        Dictionary with parsed resume fields
    """
    # Extract text based on file type
    ext = os.path.splitext(filename)[1].lower()
    if ext == ".pdf":
        raw_text = _extract_text_from_pdf(bytes_data)
    elif ext in (".doc", ".docx"):
        raw_text = _extract_text_from_docx(bytes_data)
    else:
        raw_text = bytes_data.decode("utf-8", errors="ignore")

    # Fallback regex for email/phone
    email_match = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", raw_text)
    phone_match = re.search(r"(\+?\d[\d\s().-]{7,}\d)", raw_text)

    heuristic_skills = _basic_regex_skills(raw_text)

    # Configure Gemini if available
    google_key = os.getenv("GOOGLE_API_KEY")
    if not (_HAS_GEMINI and google_key):
        # No LLM available: return heuristic result only
        return {
            "name": None,
            "email": email_match.group(0) if email_match else None,
            "phone": phone_match.group(0) if phone_match else None,
            "skills": heuristic_skills,
            "education": [],
            "experience": [],
        }

    try:
        # Initialize Gemini model
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)

        prompt = ChatPromptTemplate.from_template(
            """
            You are a resume parser. Given the raw resume text, extract:
            - full name
            - email
            - phone
            - skills (list, normalize casing)
            - education (list of concise entries)
            - experience (list of concise entries)

            Return STRICT JSON with keys: name, email, phone, skills, education, experience.
            If uncertain, set the value to null or empty list appropriately.

            Resume:
            --------
            {resume_text}
            """
        )

        chain = prompt | llm
        resp = await chain.ainvoke({"resume_text": raw_text[:20000]})

        content = resp.content if hasattr(resp, "content") else str(resp)

        # Attempt JSON extraction
        parsed: Dict = {}
        try:
            # Extract JSON from markdown code blocks if wrapped
            cleaned_content = _extract_json_from_markdown(content)
            parsed = json.loads(cleaned_content)
        except Exception as e:
            print(f"JSON parsing error in parser: {e}")
            parsed = {}

        def val(key: str, default):
            """Get value from parsed dict with fallback."""
            v = parsed.get(key)
            return v if v is not None else default

        return {
            "name": val("name", None),
            "email": val("email", email_match.group(0) if email_match else None),
            "phone": val("phone", phone_match.group(0) if phone_match else None),
            "skills": val("skills", heuristic_skills) or heuristic_skills,
            "education": val("education", []),
            "experience": val("experience", []),
        }
    
    except Exception as e:
        print(f"Error in parse_resume: {e}")
        import traceback
        traceback.print_exc()
        
        # Return heuristic fallback on error
        return {
            "name": None,
            "email": email_match.group(0) if email_match else None,
            "phone": phone_match.group(0) if phone_match else None,
            "skills": heuristic_skills,
            "education": [],
            "experience": [],
        }
