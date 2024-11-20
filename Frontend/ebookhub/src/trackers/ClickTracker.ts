// src/tracker/ClickTracker.ts
const trackClick = (elementId: string, elementType: string, additionalData: object = {}) => {
    const eventData = {
      elementId,
      elementType,
      timestamp: new Date().toISOString(),
      ...additionalData,
    };
  
    sendAnalytics("click", eventData);
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
  
  export default trackClick;
  