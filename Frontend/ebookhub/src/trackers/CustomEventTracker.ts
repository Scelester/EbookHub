// src/tracker/CustomEventTracker.ts
const trackCustomEvent = (eventName: string, eventData: object) => {
    const customEventData = {
      eventName,
      timestamp: new Date().toISOString(),
      ...eventData,
    };
  
    sendAnalytics("custom_event", customEventData);
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
  
export default trackCustomEvent;
  