// src/tracker/PageViewTracker.ts
const trackPageView = (pageName: string) => {
    const pageData = {
      pageName,
      timestamp: new Date().toISOString(),
    };
  
    sendAnalytics("pageview", pageData);
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
  
  export default trackPageView;
  