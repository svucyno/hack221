chrome.runtime.onInstalled.addListener(() => {
  console.log("Job Recommender AI extension installed!");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "PROFILE_EXTRACTED") {
    chrome.action.setBadgeText({ text: "NEW" });
    chrome.action.setBadgeBackgroundColor({ color: "#9333ea" });
    
    setTimeout(() => {
      chrome.action.setBadgeText({ text: "" });
    }, 10000);
  }
});
