// src/tracker/ScrollTracker.ts
const trackScroll = () => {
    window.addEventListener("scroll", () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      const scrollData = {
        scrollDepth,
        timestamp: new Date().toISOString(),
      };
  
      sendAnalytics("scroll", scrollData);
    });
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
  
  export default trackScroll;
  