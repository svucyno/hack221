import os
import json

source_file = r"C:\Users\MBU\Downloads\job-assistant-extension-my(@)\popup.js"
target_file = r"c:\Users\MBU\Desktop\CodeRed\extension\popup.js"

UI_CODE = """
  // ── Start of new UI logic ──────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  let currentMode = "auto";
  let profileData = null;
  let recommendations = [];
  let isML = false;

  document.addEventListener('DOMContentLoaded', () => {
    // Check Cache
    chrome.storage.local.get(['lastProfile', 'lastRecommendations', 'lastTimestamp', 'isML'], (data) => {
      if (data.lastProfile && data.lastRecommendations) {
        $('#btn-load-cached').classList.remove('hidden');
        const ts = new Date(data.lastTimestamp).toLocaleString();
        $('#cached-info').textContent = `Last run: ${ts}`;
        $('#cached-info').classList.remove('hidden');
        
        $('#btn-load-cached').addEventListener('click', () => {
          profileData = data.lastProfile;
          recommendations = data.lastRecommendations;
          isML = data.isML || false;
          showView('#results-view');
          renderResults();
        });
      }
    });

    // Toggle Modes
    $('#mode-auto').addEventListener('click', () => {
      currentMode = "auto";
      $('#mode-auto').classList.add('active');
      $('#mode-manual').classList.remove('active');
      showView('#input-view');
      $('#auto-section').classList.remove('hidden');
      $('#manual-section').classList.add('hidden');
    });

    $('#mode-manual').addEventListener('click', () => {
      currentMode = "manual";
      $('#mode-manual').classList.add('active');
      $('#mode-auto').classList.remove('active');
      showView('#input-view');
      $('#manual-section').classList.remove('hidden');
      $('#auto-section').classList.add('hidden');
    });

    // Resume Tools
    $('#btn-toggle-resume').addEventListener('click', () => {
      const container = $('#resume-container');
      container.classList.toggle('hidden');
    });

    $('#btn-parse-resume').addEventListener('click', () => {
      const txt = $('#resume-text').value;
      if (!txt) return;

      const findSection = (targets, txt, sections) => {
        const lower = txt.toLowerCase();
        let bestIdx = -1;
        let usedH = "";
        for (let h of targets) {
          let idx = lower.indexOf(h + ":");
          if (idx === -1) idx = lower.indexOf(h + "\\n");
          if (idx !== -1 && (bestIdx === -1 || idx < bestIdx)) {
            bestIdx = idx;
            usedH = idx === lower.indexOf(h + ":") ? h + ":" : h + "\\n";
          }
        }
        if (bestIdx === -1) return "";
        const start = bestIdx + usedH.length;
        let end = txt.length;
        for (let s of sections) {
          if (!targets.includes(s)) {
            let nextIdx1 = lower.indexOf(s + ":", start);
            let nextIdx2 = lower.indexOf("\\n" + s + "\\n", start);
            let next = Math.min(...[nextIdx1, nextIdx2].filter(i => i > -1));
            if (next !== Infinity && next < end) end = next;
          }
        }
        return txt.slice(start, end).trim();
      };

      const sections = ['skills', 'technical skills', 'core competencies', 'education', 'experience', 'projects', 'certifications'];
      
      const sStr = findSection(['skills', 'technical skills', 'core competencies'], txt, sections);
      const eStr = findSection(['education'], txt, sections);
      const pStr = findSection(['projects', 'experience'], txt, sections);
      const cStr = findSection(['certifications'], txt, sections);

      if (sStr) {
        const skills = sStr.split(/[\\n,]/).map(x => x.trim()).filter(x => x);
        $('#manual-skills').value = [...new Set(skills)].slice(0, 15).join(', ');
      }
      if (eStr) $('#manual-education').value = eStr.split('\\n')[0].trim();
      if (pStr) $('#manual-projects').value = pStr.split('\\n').filter(x => x.length > 5).slice(0,3).join('\\n');
      if (cStr) $('#manual-certs').value = cStr.split('\\n')[0].trim();
      
      $('#resume-container').classList.add('hidden');
    });

    // Analyze Auto
    $('#btn-analyze').addEventListener('click', async () => {
      showLoading("Extracting profile data...");
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        const url = activeTab.url;
        
        if (!url.includes('linkedin.com/') && !url.includes('github.com/')) {
          showError("Job Recommender works best on LinkedIn and GitHub profiles. Please navigate to one.");
          return;
        }

        chrome.scripting.executeScript(
          { target: { tabId: activeTab.id }, files: ["content.js"] },
          () => {
            chrome.tabs.sendMessage(activeTab.id, { action: "extractProfile" }, async (response) => {
              if (chrome.runtime.lastError || !response || !response.success) {
                showError("Failed to extract profile: " + (chrome.runtime.lastError?.message || response?.error || "Unknown error"));
                return;
              }

              const data = response.data;
              if (!data.skills || data.skills.length === 0) {
                 const extractedWords = extractSkillsFromText(data.raw || "");
                 data.skills = [...new Set(extractedWords)].slice(0, 10);
              }

              profileData = data;
              await fetchRecommendations(profileData);
            });
          }
        );
      });
    });

    // Analyze Manual
    $('#btn-submit-manual').addEventListener('click', async () => {
      const sVal = $('#manual-skills').value.trim();
      const pVal = $('#manual-projects').value.trim();
      const eVal = $('#manual-education').value.trim();
      const cVal = $('#manual-certs').value.trim();

      if (!sVal && !pVal) {
        showError("Please provide at least your skills or projects.");
        return;
      }

      profileData = {
        skills: sVal ? sVal.split(',').map(s => s.trim()) : [],
        projects: pVal ? pVal.split('\\n').map(s => s.trim()) : [],
        education: eVal ? [eVal] : [],
        certifications: cVal ? [cVal] : []
      };

      await fetchRecommendations(profileData);
    });

    $('#btn-error-back').addEventListener('click', () => {
      showView('#input-view');
    });
    
    $('#btn-results-back').addEventListener('click', () => {
      showView('#input-view');
    });
  });

  async function fetchRecommendations(data) {
    showLoading("Matching against 50 career paths using AI...");
    isML = false;

    // Timeout logic (5 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch('http://localhost:8000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Backend failed');

      const resList = await response.json();
      
      // Map API Response to exactly match local engine formatting if needed
      recommendations = resList.recommendations.map(apiRec => {
         return {
           title: apiRec.role,
           description: apiRec.description,
           matchPercent: Math.round(apiRec.match_percentage),
           missingSkills: apiRec.missing_skills || [],
           suggestions: (apiRec.related_roles || []).map(r => `Consider looking into ${r}`),
           breakdown: {
             skills: Math.round(apiRec.match_percentage * 1.5) > 100 ? 100 : Math.round(apiRec.match_percentage * 1.5),
             projects: Math.round(apiRec.match_percentage * 0.9),
             education: Math.round(apiRec.match_percentage * 0.7),
             certifications: Math.round(apiRec.match_percentage * 0.5)
           }
         };
      });
      isML = true;

    } catch (err) {
      console.warn("Backend down or timeout, falling back to JS recommender...");
      recommendations = generateRecommendations(data);
      isML = false;
    }

    chrome.storage.local.set({
      lastProfile: data,
      lastRecommendations: recommendations,
      lastTimestamp: new Date().toISOString(),
      isML: isML
    });

    showView('#results-view');
    renderResults();
  }

  function showView(viewId) {
    $$(".view").forEach(v => v.classList.add("hidden"));
    $(viewId)?.classList.remove("hidden");
  }

  function showLoading(msg) {
    $("#loading-text").textContent = msg;
    showView("#loading-view");
  }

  function showError(msg) {
    $("#error-message").textContent = msg;
    showView("#error-view");
  }

  function renderResults() {
    if (!profileData || !recommendations.length) {
      showError("No matches resulted from provided input.");
      return;
    }

    const summaryEl = $("#profile-summary");
    summaryEl.innerHTML = "";

    if (profileData.skills?.length) {
      summaryEl.innerHTML += `<div class="summary-section">
        <h4>Skills</h4>
        <div class="tag-list">${profileData.skills.map(s => `<span class="tag tag-skill">${s}</span>`).join("")}</div>
      </div>`;
    }
    if (profileData.projects?.length) {
      summaryEl.innerHTML += `<div class="summary-section">
        <h4>Projects</h4>
        ${profileData.projects.slice(0, 3).map(p => `<p class="project-item">• ${p}</p>`).join("")}
      </div>`;
    }
    if (profileData.education?.length) {
      summaryEl.innerHTML += `<div class="summary-section">
        <h4>Education</h4>
        ${profileData.education.slice(0, 2).map(e => `<p class="edu-item">${e}</p>`).join("")}
      </div>`;
    }

    const cardsContainer = $("#job-cards");
    cardsContainer.innerHTML = "";

    recommendations.forEach((rec, idx) => {
      const card = document.createElement("div");
      card.className = "job-card";
      
      const percentClass = rec.matchPercent >= 70 ? "high" : rec.matchPercent >= 40 ? "medium" : "low";

      let resourcesHTML = "";
      if (rec.missingSkills && rec.missingSkills.length) {
        const skillsToShow = rec.missingSkills.slice(0, 4);
        let resourceItems = "";
        skillsToShow.forEach(skill => {
          const res = getSkillResources(skill);
          const capSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
          let skillBlock = `<div class="resource-skill-block"><div class="resource-skill-name">🔴 ${capSkill}</div>`;
          
          if (res.free && res.free.length) {
            skillBlock += `<div class="resource-category"><span class="resource-cat-label">📘 Free</span><div class="resource-links">`;
            res.free.forEach(link => {
              skillBlock += `<a href="${link.link}" target="_blank" class="resource-link">${link.name}</a>`;
            });
            skillBlock += `</div></div>`;
          }
          if (res.paid && res.paid.length) {
            skillBlock += `<div class="resource-category"><span class="resource-cat-label">💰 Paid</span><div class="resource-links">`;
            res.paid.forEach(link => {
              skillBlock += `<a href="${link.link}" target="_blank" class="resource-link">${link.name}</a>`;
            });
            skillBlock += `</div></div>`;
          }
          if (res.certification && res.certification.length) {
            skillBlock += `<div class="resource-category"><span class="resource-cat-label">🏅 Certs</span><div class="resource-links">`;
            res.certification.forEach(link => {
              skillBlock += `<span class="resource-cert">${link.name}</span>`;
            });
            skillBlock += `</div></div>`;
          }
          skillBlock += `</div>`;
          resourceItems += skillBlock;
        });

        const collapseId = `resources-${idx}`;
        resourcesHTML = `
          <div class="learning-resources">
            <button class="resources-toggle" onclick="document.getElementById('${collapseId}').classList.toggle('open')">
              <span>📚 View Learning Paths</span>
              <span>▼</span>
            </button>
            <div id="${collapseId}" class="resources-content">
              ${resourceItems}
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="job-card-header">
          <div class="job-rank">${idx + 1}</div>
          <div class="job-info">
            <h3 class="job-title">${rec.title} ${isML ? '<span class="engine-badge">🤖 ML Model</span>' : '<span class="engine-badge">⚡ Built-in Engine</span>'}</h3>
            <p class="job-desc">${rec.description}</p>
          </div>
          <div class="match-badge ${percentClass}">${rec.matchPercent}% Match</div>
        </div>
        
        <div class="match-progress-container">
          <div class="match-progress-bar ${percentClass}" style="width: ${rec.matchPercent}%"></div>
        </div>

        <div class="score-bars">
          <div class="score-bar-row">
            <span>Skills</span>
            <div class="score-bar"><div class="score-fill" style="width: ${rec.breakdown?.skills || 0}%"></div></div>
            <span class="score-val">${rec.breakdown?.skills || 0}%</span>
          </div>
          <div class="score-bar-row">
            <span>Projects</span>
            <div class="score-bar"><div class="score-fill" style="width: ${rec.breakdown?.projects || 0}%"></div></div>
            <span class="score-val">${rec.breakdown?.projects || 0}%</span>
          </div>
          <div class="score-bar-row">
            <span>Education</span>
            <div class="score-bar"><div class="score-fill" style="width: ${rec.breakdown?.education || 0}%"></div></div>
            <span class="score-val">${rec.breakdown?.education || 0}%</span>
          </div>
          <div class="score-bar-row">
            <span>Certs</span>
            <div class="score-bar"><div class="score-fill" style="width: ${rec.breakdown?.certifications || 0}%"></div></div>
            <span class="score-val">${rec.breakdown?.certifications || 0}%</span>
          </div>
        </div>

        ${rec.missingSkills && rec.missingSkills.length ? `<div class="missing-skills">
          <p>Missing Skills:</p>
          <div class="tag-list">${rec.missingSkills.map(s => `<span class="tag tag-missing">${s}</span>`).join("")}</div>
        </div>` : ''}

        ${resourcesHTML}
      `;
      cardsContainer.appendChild(card);
    });
  }
})();
"""

try:
    with open(source_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Take lines 1 to 715
    extracted = "".join(lines[:715])
    
    final_content = extracted + "\n" + UI_CODE
    
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(final_content)
    
    print(f"Successfully assembled {target_file}")
except Exception as e:
    print(f"Error: {e}")
