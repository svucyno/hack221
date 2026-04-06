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
    // Programming Languages
    "python", "javascript", "java", "c\\+\\+", "c\#", "c", "r", "ruby", "go", "rust", "swift",
    "kotlin", "dart", "php", "scala", "typescript", "bash", "shell", "powershell", "lua", "perl",
    // Web Technologies
    "html", "css", "sass", "less", "tailwind", "bootstrap", "material ui", "daisy ui",
    "react", "angular", "vue", "svelte", "next\\.js", "nuxt", "gatsby", "remix", "astro",
    "node\\.js", "express", "django", "flask", "spring", "fastapi", "rails", "laravel",
    "graphql", "rest api", "microservices", "serverless", "socket\\.io", "web sockets",
    "jquery", "redux", "mobx", "recoil", "pinia", "rxjs", "three\\.js", "webgl",
    // Mobile
    "react native", "flutter", "ionic", "xamarin", "native script", "android sdk", "ios sdk",
    // Data Science & ML
    "tensorflow", "pytorch", "scikit-learn", "keras", "opencv", "hugging face", "langchain",
    "machine learning", "deep learning", "nlp", "computer vision", "ai", "llm", "generative ai",
    "data analysis", "data visualization", "statistics", "pandas", "numpy", "matplotlib", "seaborn",
    "tableau", "power bi", "looker", "d3\\.js", "scipy", "nltk", "spacy", "genism",
    // DevOps & Cloud
    "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ansible", "jenkins",
    "ci/cd", "github actions", "gitlab ci", "prometheus", "grafana", "elk stack", "monitoring",
    "git", "linux", "agile", "scrum", "kanban", "serverless", "lambda", "amplify",
    // Databases
    "sql", "nosql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "firebase",
    "dynamodb", "cassandra", "supabase", "prisma", "sequelize", "mongoose", "mariadb", "oracle",
    // Design & Tools
    "figma", "sketch", "adobe xd", "photoshop", "illustrator",
    "unity", "unreal engine", "blender", "webgpu",
    // Blockchain
    "solidity", "web3\\.js", "ethereum", "blockchain", "ethers\\.js", "polkadot", "polygon",
    // Testing
    "selenium", "cypress", "jest", "playwright", "mocha", "chai", "enzyme", "jasmine",
    // Big Data
    "apache spark", "hadoop", "kafka", "airflow", "snowflake", "databricks", "bigquery",
    // Security
    "networking", "security", "encryption", "penetration testing", "cybersecurity", "iam",
    // IoT & hardware
    "embedded systems", "iot", "rtos", "microcontrollers", "arduino", "raspberry pi",
    // Business & Management
    "product management", "technical writing", "user research", "seo", "marketing", "leadership",
    "project management", "sdlc", "scrum master", "product owner"
  ];
  
  const text = (rawText || "").toLowerCase();
  const found = [];
  
  for (const skillPattern of knownSkills) {
    // Escape dots for regex but allow for common variations like react.js vs reactjs
    let pattern = skillPattern;
    if (pattern.includes('\\.')) {
      const base = pattern.replace('\\.', '');
      pattern = `(${pattern}|${base}js|${base}\\sjs)`;
    }
    
    const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
    if (regex.test(text)) {
      // Return the clean version (without regex escapes)
      const cleanName = skillPattern.replace(/\\/g, '');
      if (!found.includes(cleanName)) found.push(cleanName);
    }
  }
  return found;
}

function extractLinkedInProfileAsync() {
  return new Promise((resolve) => {
    // Wait for dynamic content via MutationObserver or max timeout
    let observer;
    let timer;
    
    const finalizeExtraction = () => {
      if (observer) observer.disconnect();
      if (timer) clearTimeout(timer);
      resolve(performExtraction());
    };

    // Wait 5 seconds minimum
    setTimeout(() => {
      // After 5s wait, wait for DOM idle using MutationObserver
      let idleTimer = setTimeout(finalizeExtraction, 2000); // 2s idle timeout
      
      observer = new MutationObserver(() => {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(finalizeExtraction, 2000);
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
      
      // Fallback max wait 10s after the 5s
      timer = setTimeout(finalizeExtraction, 10000);
    }, 5000);
  });
}

function performExtraction() {
  const data = {
    name: document.querySelector("h1")?.innerText?.trim() || "",
    headline: document.querySelector(".text-body-medium")?.innerText?.trim() || "",
    skills: [],
    education: [],
    certifications: [],
    projects: [],
    raw: document.body.innerText // Add raw text for fallback extraction
  };

  const filterSkillStrict = (skill) => {
    if (!skill || typeof skill !== 'string') return false;
    skill = skill.trim();
    if (skill.length < 2) return false;
    if (skill.length > 40) return false;
    if (skill.split(/\s+/).length > 4) return false;
    if (/^\d+$/.test(skill)) return false;

    const exactCapsBanned = ['LIVE', 'TOP', 'NEW', 'HOT', 'PRO', 'ADS', 'APP', 'NOW'];
    if (skill.length < 6 && skill === skill.toUpperCase() && exactCapsBanned.includes(skill)) return false;

    const lower = skill.toLowerCase();
    const banned = [
      'linkedin', 'sign in', 'join', 'follower', 'connection', 'repost', 'comment', 
      'reaction', 'http', 'www', 'ago', 'view', 'show', 'see', 'load', 'notification',
      'message', 'search', 'home', 'network', 'job', 'gaming', 'business', 'learning'
    ];
    for (const b of banned) {
      if (lower.includes(b)) return false;
    }
    
    // Look like real skill names (basic check)
    if (!/[a-zA-Z]/.test(skill)) return false;

    return true;
  };

  const findTargetSections = (keywords) => {
    let targetSecs = [];
    document.querySelectorAll('section').forEach(sec => {
      const aria = (sec.getAttribute('aria-label') || '').toLowerCase();
      const id = (sec.id || '').toLowerCase();
      let match = false;
      for (const k of keywords) {
        if (aria.includes(k) || id.includes(k)) match = true;
      }
      
      if (!match) {
        sec.querySelectorAll('div[id]').forEach(div => {
           const divId = (div.id || '').toLowerCase();
           for (const k of keywords) {
             if (divId.includes(k)) match = true;
           }
        });
      }
      
      if (!match) {
         const heading = sec.querySelector('h2');
         if (heading) {
            const hText = heading.textContent.toLowerCase();
            for (const k of keywords) {
               if (hText.includes(k)) match = true;
            }
         }
      }

      if (match && !targetSecs.includes(sec)) targetSecs.push(sec);
    });
    return targetSecs;
  };

  const getSkills = () => {
    let extracted = [];
    const addSkill = (text) => {
      const s = text.trim().replace(/\n/g, " ");
      if (filterSkillStrict(s) && !extracted.includes(s)) extracted.push(s);
    };

    const skillSections = findTargetSections(['skill']);

    // 1. .pvs-list__item--line-separated .visually-hidden inside skill section
    document.querySelectorAll('.pvs-list__item--line-separated .visually-hidden').forEach(el => {
      const section = el.closest('section');
      if (skillSections.includes(section)) addSkill(el.textContent);
    });

    // 2. [data-field="skill_categories_skill"] span[aria-hidden="true"]
    document.querySelectorAll('[data-field="skill_categories_skill"] span[aria-hidden="true"]').forEach(el => addSkill(el.textContent));

    // 3. .pv-skill-category-entity__name-text
    document.querySelectorAll('.pv-skill-category-entity__name-text').forEach(el => addSkill(el.textContent));

    // 4. Any span[aria-hidden="true"] that is a direct child of a list item inside a section with id or aria-label containing 'skill'
    skillSections.forEach(sec => {
      sec.querySelectorAll('li > span[aria-hidden="true"]').forEach(el => addSkill(el.textContent));
    });

    // 5. Look for any section that has a heading with "Skills"
    document.querySelectorAll('section').forEach(sec => {
      const h2 = sec.querySelector('h2');
      if (h2 && h2.textContent.toLowerCase().includes('skills')) {
        // Find list items
        sec.querySelectorAll('li').forEach(li => {
          // LinkedIn updated structure often puts skill name in a span with visually-hidden or just a simple span
          const span = li.querySelector('span[aria-hidden="true"]');
          if (span) addSkill(span.textContent);
          
          const hidden = li.querySelector('.visually-hidden');
          if (hidden) addSkill(hidden.textContent);
        });
      }
    });

    return extracted;
  };

  let skills = getSkills();

  if (skills.length < 3) {
    let skillsText = "";
    findTargetSections(['skill']).forEach(sec => {
      skillsText += " " + sec.textContent;
    });
    
    // If no dedicated skill section found, use entire page body as fallback
    if (!skillsText.trim() || skillsText.length < 50) {
       skillsText = document.body.innerText;
    }

    const fallbackSkills = extractSkillsFromTextStr(skillsText);
    for (const s of fallbackSkills) {
      if (!skills.includes(s)) skills.push(s);
    }
  }

  data.skills = skills;

  // Education
  findTargetSections(['education', 'university', 'school', 'degree']).forEach(sec => {
      sec.querySelectorAll('.pvs-list__item--line-separated, .pv-education-entity').forEach(item => {
        const texts = Array.from(item.querySelectorAll('span[aria-hidden="true"]'))
                           .map(el => el.textContent.trim().replace(/\n/g, " ")).filter(t => t);
        if (texts.length > 0) {
           // Often: University Name, Degree, Dates
           const eduStr = texts.slice(0, 3).join(' - ');
           if (eduStr && !data.education.includes(eduStr)) data.education.push(eduStr);
        }
      });
  });

  // Experience, Projects, Volunteer
  findTargetSections(['experience', 'projects', 'volunteer', 'honors']).forEach(sec => {
      sec.querySelectorAll('.pvs-list__item--line-separated, .pv-position-entity, .pv-volunteer-causes-entity').forEach(item => {
        const texts = Array.from(item.querySelectorAll('span[aria-hidden="true"]'))
                           .map(el => el.textContent.trim().replace(/\n/g, " ")).filter(t => t);
        if (texts.length > 0) {
           // Often: Role, Company, Dates, Description summary
           const details = texts.slice(0, 3).join(' at ');
           if (details && !data.projects.includes(details)) data.projects.push(details);
        }
      });
  });

  // Certifications
  findTargetSections(['licenses', 'certifications', 'certification', 'courses', 'course']).forEach(sec => {
      sec.querySelectorAll('.pvs-list__item--line-separated, .pv-certifications-entity').forEach(item => {
        const texts = Array.from(item.querySelectorAll('span[aria-hidden="true"]'))
                           .map(el => el.textContent.trim().replace(/\n/g, " ")).filter(t => t);
        if (texts.length > 0) {
           const certName = texts[0];
           if (certName && !data.certifications.includes(certName)) data.certifications.push(certName);
        }
      });
  });

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
            if (data.skills.length === 0) {
              showToast("⚠️ Could not extract skills. Please use Manual Input tab and enter your skills directly.");
            } else {
              showToast(`✅ Job Recommender AI: Found ${data.skills.length} skills, ${data.education.length} education, ${data.projects.length} projects from LinkedIn!`);
            }
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
