// src/tracker/FocusTracker.ts
const trackFocus = () => {
    const searchInput = document.querySelector("input[name='searchQuery']");
  
    if (searchInput) {
      searchInput.addEventListener("focus", () => {
        sendAnalytics("search_focus", { timestamp: new Date().toISOString() });
      });
    }
  };
  
  const sendAnalytics = (eventType: string, data: object) => {
    fetch("/api/analytics/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventType, data }),
    });
  };
  
  export default trackFocus;
  