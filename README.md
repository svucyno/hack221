# 🚀 Job Recommender AI – Intelligent Career Assistant

**Job Recommender AI** is a powerful Chrome extension and backend API that uses state-of-the-art Natural Language Processing (NLP) to match professional profiles to 50+ high-demand tech career paths.

![Screenshot of Job Recommender AI](icon128.png)

## ✨ Features

- **Profile Extraction**: Automatically scrapes skills, education, projects, and certifications from **LinkedIn** and **GitHub** profiles.
- **Dual Matching Engine**:
  - **🤖 AI Model**: Uses `Sentence Transformers` (Semantic Similarity) to understand the context of your experience beyond just keywords.
  - **⚡ Built-in Engine**: A robust fallback matching algorithm that ensures you always get results even when offline.
- **Interactive UI**:
  - **Auto-Extract**: One-click profile parsing.
  - **Manual Input**: Refine your profile with tags and detailed descriptions.
  - **Resume Parsing**: Paste your resume text to quickly extract skills.
- **Learning Paths**: Provides curated free/paid courses and certifications for your missing skills.
- **Skill Gap Analysis**: Visual breakdown of how well you match each role across Skills, Projects, Education, and Certifications.

---

## 🛠️ Tech Stack

- **Frontend**: HTML, Vanilla JavaScript (ES6+), CSS3 (Modern Flexbox/Grid), Chrome Extension API.
- **Backend**: Python 3.9+, FastAPI, Uvicorn.
- **Machine Learning**: `Sentence-Transformers` (`all-MiniLM-L6-v2`), NumPy, PyTorch.

---

## 🚀 Getting Started

### 1. Backend Setup (ML API)

The backend provides the semantic matching engine.

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install fastapi uvicorn sentence-transformers numpy pydantic

# Start the server
python main.py
```
*The server will run on `http://localhost:8000`.*

### 2. Extension Installation

1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top right).
3. Click **Load unpacked**.
4. Select the root folder of this project (the folder containing `manifest.json`).

---

## 📖 How to Use

### On LinkedIn/GitHub:
1. Navigate to a profile page (e.g., `linkedin.com/in/username`).
2. Open the **Job Recommender AI** extension.
3. Click **Auto Extract** (ensure you are on the "Auto Extract" tab).
4. The extension will scrape the profile and present matched job roles.

### Manual Mode:
1. Open the extension and switch to the **Manual Input** tab.
2. Enter your skills (comma-separated), projects, and education.
3. Click **Generate Recommendations** to see your top matches.

---

## 📊 Evaluation Logic

The recommendation engine weights your profile as follows:
- **Skills (40%)**: Exact and fuzzy keyword matching.
- **Projects (30%)**: Semantic relevance of project descriptions to job keywords.
- **Education (20%)**: Academic background alignment.
- **Certifications (10%)**: Specialized credentials.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 🚀 Project Resources

📄 **Report:**  
👉 [Click to View PDF](./docs/project-report.pdf)

🎤 **Presentation:**  
👉 [Click to View Slides](./docs/presentation.pptx)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
