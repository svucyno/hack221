function showToast(message) {
  const existingToast = document.getElementById("job-recommender-toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.id = "job-recommender-toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #6b21a8, #c026d3);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(107, 33, 168, 0.3);
    z-index: 999999;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(toast);
  
  // Fade in
  setTimeout(() => toast.style.opacity = "1", 10);
  
  // Fade out and remove
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function normalizeTextToFindSkills(text) {
  return (text || "").toLowerCase().replace(/[^a-z0-9\s\+\#\.\/]/g, " ").replace(/\s+/g, " ").trim();
}

function extractSkillsFromTextStr(rawText) {
  const knownSkills = [
    "python", "javascript", "java", "c++", "c#", "c", "r", "ruby", "go", "rust", "swift",
    "kotlin", "dart", "php", "scala", "typescript", "sql", "nosql", "bash", "shell",
    "html", "css", "sass", "less", "tailwind", "bootstrap",
    "react", "angular", "vue", "svelte", "next.js", "nuxt", "gatsby",
    "node.js", "express", "django", "flask", "spring", "fastapi", "rails",
    "react native", "flutter", "swift", "kotlin",
    "tensorflow", "pytorch", "scikit-learn", "keras", "opencv", "hugging face",
    "machine learning", "deep learning", "nlp", "computer vision", "ai",
    "data analysis", "data visualization", "statistics", "pandas", "numpy", "matplotlib",
    "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ansible",
    "ci/cd", "jenkins", "github actions", "gitlab ci",
    "git", "linux", "agile", "scrum",
    "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "firebase",
    "graphql", "rest api", "microservices", "serverless",
    "figma", "sketch", "adobe xd", "photoshop",
    "unity", "unreal engine", "blender",
    "solidity", "web3.js", "ethereum", "blockchain",
    "selenium", "cypress", "jest", "playwright",
    "apache spark", "hadoop", "kafka", "airflow",
    "networking", "security", "encryption", "penetration testing",
    "embedded systems", "iot", "rtos", "microcontrollers",
    "product management", "technical writing", "user research"
  ];
  const text = normalizeTextToFindSkills(rawText);
  const found = [];
  for (const skill of knownSkills) {
    if (text.includes(skill) && !found.includes(skill)) found.push(skill);
  }
  return found;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function extractLinkedInProfileAsync() {
  const data = {
    name: document.querySelector("h1")?.innerText?.trim() || "",
    headline: document.querySelector(".text-body-medium")?.innerText?.trim() || "",
    skills: [],
    education: [],
    certifications: [],
    projects: []
  };

  const filterSkillStrict = (skill) => {
    if (!skill) return false;
    if (skill.length > 40) return false;
    if (skill.split(/\s+/).length > 4) return false;
    
    const lower = skill.toLowerCase();
    const banned = ['linkedin', 'sign', 'join', 'follower', 'connection', 'repost', 'comment', 'reaction', 'http', 'www', 'ago', 'view', 'show', 'see', 'load'];
    for (const b of banned) {
      if (lower.includes(b)) return false;
    }
    
    if (!/[a-zA-Z]/.test(skill)) return false;
    return true;
  };

  const getSkills = () => {
    let extracted = [];
    
    let firstTryEls = [];
    document.querySelectorAll('section').forEach(sec => {
      const aria = (sec.getAttribute('aria-label') || '').toLowerCase();
      const id = (sec.id || '').toLowerCase();
      if (aria.includes('skill') || id.includes('skill')) {
        sec.querySelectorAll("span[aria-hidden='true']").forEach(el => firstTryEls.push(el));
      }
    });

    const prioritySelectors = [
      firstTryEls,
      Array.from(document.querySelectorAll(".pvs-list__item--line-separated .visually-hidden")),
      Array.from(document.querySelectorAll("[data-field='skill_categories_skill'] span[aria-hidden='true']")),
      Array.from(document.querySelectorAll(".pv-skill-category-entity__name-text")),
      Array.from(document.querySelectorAll("section span[aria-hidden='true']"))
    ];

    for (const elements of prioritySelectors) {
      for (const el of elements) {
        const skill = el.innerText.trim();
        if (filterSkillStrict(skill) && !extracted.includes(skill)) {
          extracted.push(skill);
        }
      }
      if (extracted.length >= 3) break; 
    }
    return extracted;
  };

  let maxRetries = 3;
  let attempt = 0;
  
  await sleep(6000); 
  let skills = getSkills();
  
  while ((skills.length === 0 || skills.length < 3) && attempt < maxRetries) {
    attempt++;
    await sleep(3000);
    skills = getSkills();
  }

  if (skills.length === 0) {
    let combinedText = "";
    document.querySelectorAll("section").forEach(sec => {
      const aria = (sec.getAttribute('aria-label') || '').toLowerCase();
      const id = (sec.id || '').toLowerCase();
      if (aria.includes('skill') || id.includes('skill') || aria.includes('experience') || id.includes('experience') || aria.includes('about') || id.includes('about')) {
        combinedText += " " + sec.innerText;
      }
    });
    skills = extractSkillsFromTextStr(combinedText);
  }
  
  data.skills = skills;

  // Education
  const eduSelectors = [
    ".pv-education-entity",
    "[data-field='education_school_name']"
  ];
  for (const selector of eduSelectors) {
    document.querySelectorAll(selector).forEach(el => {
      const edu = el.innerText.trim();
      if (edu && !data.education.includes(edu)) data.education.push(edu);
    });
  }

  // Certifications
  const certSelectors = [
    ".pv-certification-entity",
    "[data-field='certifications'] span"
  ];
  for (const selector of certSelectors) {
    document.querySelectorAll(selector).forEach(el => {
      const cert = el.innerText.trim();
      if (cert && !data.certifications.includes(cert)) data.certifications.push(cert);
    });
  }

  // Experience/Projects
  const expSelectors = [
    ".pv-entity__summary-info h3",
    ".pv-profile-section__card-item-v2 h3"
  ];
  for (const selector of expSelectors) {
    document.querySelectorAll(selector).forEach(el => {
      const exp = el.innerText.trim();
      if (exp && !data.projects.includes(exp)) data.projects.push(exp);
    });
  }

  return data;
}

function extractGitHubProfile() {
  const data = {
    name: document.querySelector(".vcard-fullname")?.innerText?.trim() || "",
    bio: document.querySelector(".user-profile-bio")?.innerText?.trim() || "",
    skills: [],
    projects: []
  };

  // Pinned repos
  document.querySelectorAll(".pinned-item-list-item-content").forEach(el => {
    const repoName = el.querySelector(".repo")?.innerText?.trim() || "";
    const repoDesc = el.querySelector(".pinned-item-desc")?.innerText?.trim() || "";
    if (repoName) {
      data.projects.push(`${repoName}: ${repoDesc}`);
    }
  });

  // Languages
  document.querySelectorAll("[itemprop='programmingLanguage']").forEach(el => {
    const lang = el.innerText.trim();
    if (lang && !data.skills.includes(lang)) data.skills.push(lang);
  });

  return data;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractProfile") {
    (async () => {
      try {
        const url = window.location.href;
        let data = null;

        if (url.includes("linkedin.com/in/")) {
          data = await extractLinkedInProfileAsync();
        } else if (url.includes("github.com/")) {
          data = extractGitHubProfile();
        }

        if (data) {
          if (url.includes("linkedin.com/in/")) {
            showToast(`✅ Job Recommender AI: Found ${data.skills.length} skills from LinkedIn!`);
          } else {
            showToast("✅ Job Recommender AI: Profile extracted! Open the extension.");
          }
          chrome.runtime.sendMessage({ action: "PROFILE_EXTRACTED" });
          sendResponse({ success: true, data: data });
        } else {
          sendResponse({ success: false, error: "Not a supported profile page." });
        }
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true; // Keep message channel open for async response
  }
});
