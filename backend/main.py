import json
import os
from typing import List, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
import numpy as np
import uvicorn

# Load job roles
JOB_ROLES_FILE = os.path.join(os.path.dirname(__file__), "job_roles.json")
if not os.path.exists(JOB_ROLES_FILE):
    raise RuntimeError("job_roles.json not found. Please ensure it exists in the backend directory.")

with open(JOB_ROLES_FILE, "r") as f:
    JOB_ROLES = json.load(f)

def build_job_text(job: Dict[str, Any]) -> str:
    """Joins job requirements, preferences, and description into a lowercase string."""
    elements = job.get("required_skills", []) + job.get("preferred_skills", []) + [job.get("description", "")]
    return " ".join([str(e).lower() for e in elements])

print("Loading Sentence Transformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("[Job Recommender AI] Sentence Transformer model loaded successfully")

job_texts = [build_job_text(job) for job in JOB_ROLES]
job_embeddings = model.encode(job_texts, convert_to_tensor=True)
print(f"[Job Recommender AI] Job embeddings precomputed for {len(JOB_ROLES)} roles")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CandidateProfile(BaseModel):
    """Pydantic model for a candidate profile."""
    skills: List[str]
    projects: List[str]
    education: str
    certifications: List[str] = []

def build_candidate_text(profile: CandidateProfile) -> str:
    """Joins all candidate details into a single lowercase string for vectorization."""
    elements = profile.skills + profile.projects + [profile.education] + profile.certifications
    return " ".join([str(e).lower() for e in elements])

def calculate_skill_match(candidate_skills: List[str], job: Dict[str, Any]) -> dict:
    """Calculates skill match percentage and lists missing required skills."""
    cand_set = set(s.lower() for s in candidate_skills)
    req_skills_original = job.get("required_skills", [])
    
    if not req_skills_original:
        return {"score": 100.0, "missing_skills": []}
        
    matched = 0
    missing = []
    
    for req in req_skills_original:
        if req.lower() in cand_set:
            matched += 1
        else:
            missing.append(req)
            
    score = (matched / len(req_skills_original)) * 100
    return {"score": score, "missing_skills": missing}

def calculate_final_score(semantic_score: float, skill_score: float) -> float:
    """Calculates the weighted average of semantic similarity and skill score."""
    return round((semantic_score * 0.5) + (skill_score * 0.5), 1)

@app.post("/recommend")
async def recommend_jobs(profile: CandidateProfile):
    """Recommends top jobs based on the provided candidate profile."""
    try:
        candidate_text = build_candidate_text(profile)
        candidate_embedding = model.encode([candidate_text], convert_to_tensor=True)
        
        # sentence_transformers.util.cos_sim returns a matrix, we extract the first row [0]
        cos_scores = util.cos_sim(candidate_embedding, job_embeddings)[0]
        # Convert tensor scores to list of floats
        semantic_sim = cos_scores.tolist()
        
        results = []
        for i, job in enumerate(JOB_ROLES):
            # Scale semantic score from 0-1 to 0-100 (clamp at 0 just in case)
            raw_sim = float(semantic_sim[i])
            semantic_score = max(0.0, raw_sim) * 100
            
            skill_info = calculate_skill_match(profile.skills, job)
            skill_score = skill_info["score"]
            missing_skills = skill_info["missing_skills"]
            
            final_match = calculate_final_score(semantic_score, skill_score)
            
            results.append({
                "role": job.get("role"),
                "match_percentage": final_match,
                "description": job.get("description"),
                "missing_skills": missing_skills,
                "experience_level": job.get("experience_level"),
                "related_roles": job.get("related_roles", [])
            })
            
        results.sort(key=lambda x: x["match_percentage"], reverse=True)
        return {"recommendations": results[:8]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/skill-gap")
async def skill_gap(profile: CandidateProfile):
    """Computes missing skills for all jobs and returns them sorted by least missing."""
    try:
        results = []
        for job in JOB_ROLES:
            skill_info = calculate_skill_match(profile.skills, job)
            results.append({
                "role": job.get("role"),
                "missing_skills": skill_info["missing_skills"],
                "missing_count": len(skill_info["missing_skills"])
            })
            
        results.sort(key=lambda x: x["missing_count"])
        
        return {
            "skill_gaps": [
                {
                    "role": r["role"],
                    "missing_skills": r["missing_skills"]
                }
                for r in results
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model-info")
async def model_info():
    """Returns information about the loaded sentence transformer model."""
    return {
        "model": "all-MiniLM-L6-v2",
        "type": "Sentence Transformer",
        "embedding_dimensions": 384,
        "total_job_roles": 50
    }

@app.get("/health")
async def health_check():
    """Returns the health status of the API and total jobs loaded."""
    return {
        "status": "running",
        "total_roles": 50,
        "model": "all-MiniLM-L6-v2",
        "model_status": "loaded"
    }

if __name__ == "__main__": 
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
