// Listener for extension installation or tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("linkedin.com")) {
    syncCookies();
  }
});

function syncCookies() {
  chrome.cookies.get({ url: "https://www.linkedin.com", name: "li_at" }, (liAtCookie) => {
    chrome.cookies.get({ url: "https://www.linkedin.com", name: "JSESSIONID" }, (jSessionIdCookie) => {
      if (liAtCookie && jSessionIdCookie) {
        const liAt = liAtCookie.value;
        const jSessionId = jSessionIdCookie.value;

        // Post cookies to local development or production backend
        fetch("http://localhost:3000/api/linkedin/cookies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            liAt,
            jSessionId
          })
        })
        .then(res => res.json())
        .then(data => {
          console.log("LinkedIn session cookies successfully synced to Dashboard:", data);
        })
        .catch(err => {
          console.error("Failed to sync cookies to local dashboard API:", err);
        });
      }
    });
  });
}
