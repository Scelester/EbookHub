// src/tracker/UserInteractionTracker.ts
const trackUserInteraction = (interactionType: string, additionalData: object) => {
    const interactionData = {
      interactionType,
      timestamp: new Date().toISOString(),
      ...additionalData,
    };
  
    sendAnalytics("user_interaction", interactionData);
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
  
  export default trackUserInteraction;
