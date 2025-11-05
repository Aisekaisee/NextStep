import os
import json
from typing import Dict, List
from pydantic import BaseModel, Field

from langchain_core.prompts import ChatPromptTemplate

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    _HAS_GEMINI = True
except Exception:
    _HAS_GEMINI = False


# Define Pydantic models for structured output
class CareerRecommendation(BaseModel):
    """Single career recommendation with supporting details."""
    title: str = Field(description="Specific job title with tech stack (e.g., 'Frontend Developer (React)')")
    probability: int = Field(description="Confidence score between 50-95 based on resume evidence")
    explanation: str = Field(description="Detailed explanation referencing specific skills and experience from resume")
    supportingSkills: List[str] = Field(description="List of candidate's skills that support this role recommendation")


class CareerRecommendations(BaseModel):
    """Container for exactly 3 career recommendations."""
    recommendations: List[CareerRecommendation] = Field(
        description="Exactly 3 career recommendations ranked by fit",
        min_length=3,
        max_length=3
    )


async def recommend_careers(parsed: Dict) -> Dict:
    """
    Recommends careers based on parsed resume data using Gemini LLM with structured output.
    
    Args:
        parsed: Dictionary containing resume data with skills, experience, and projects
        
    Returns:
        Dictionary with skills list and top 3 career recommendations
    """
    skills: List[str] = parsed.get("skills", []) or []

    # Check if Gemini is available
    google_key = os.getenv("GOOGLE_API_KEY")
    if not (_HAS_GEMINI and google_key):
        return {"skills": skills, "recommendations": []}

    try:
        # Initialize Gemini model with updated model name
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0
        )
        
        # Apply structured output (no method parameter for compatibility)
        structured_llm = llm.with_structured_output(CareerRecommendations)

        # Create prompt template
        prompt = ChatPromptTemplate.from_template(
            """
            You are a career assistant. From the parsed resume, output the TOP 3 MOST SUITABLE roles.
            BE SPECIFIC and choose from this taxonomy when possible:
            - Web/Frontend Developer (React/Vue/Angular)
            - Backend Engineer (Node.js/Java Spring/Python Django/Flask/FastAPI)
            - Full Stack Developer (specify major frontend + backend)
            - Mobile Developer (Android/iOS/Flutter/React Native)
            - Machine Learning Engineer
            - Data Engineer
            - Data Analyst / Business Intelligence
            - DevOps / Cloud Engineer (AWS/Azure/GCP, Docker, Kubernetes)
            - UI/UX Designer
            - Product Designer

            Rules:
            - Prefer precise stack labels when clear (e.g., "Frontend Developer (React)", "Backend Engineer (Node.js)").
            - Avoid generic titles like "Software Engineer" unless resume is extremely ambiguous.
            - Explanations must reference concrete skills/experience found in the resume.
            - Probabilities should be calibrated confidence (50..95). Use higher scores when strong evidence exists.
            - supportingSkills must be a SUBSET of the candidate's actual skills that justify the role.

            IMPORTANT: Return EXACTLY 3 recommendations, ranked by probability/fit.

            Parsed Resume (JSON):
            {parsed}
            """
        )

        # Create chain and invoke
        chain = prompt | structured_llm
        result = await chain.ainvoke({"parsed": json.dumps(parsed)})
        
        # Convert Pydantic objects to dictionaries
        recommendations = [
            {
                "title": rec.title,
                "probability": rec.probability,
                "explanation": rec.explanation,
                "supportingSkills": rec.supportingSkills
            }
            for rec in result.recommendations
        ]
        
        # Sort by probability descending
        recommendations.sort(key=lambda x: x["probability"], reverse=True)
        
        return {
            "skills": skills,
            "recommendations": recommendations
        }
        
    except Exception as e:
        # Log the error for debugging
        print(f"Error in career recommendation: {e}")
        import traceback
        traceback.print_exc()
        
        # Return empty recommendations on error
        return {
            "skills": skills,
            "recommendations": []
        }
