const trackSearch = (query: string, resultsCount: number) => {
    const searchData = {
      query,
      resultsCount,
      timestamp: new Date().toISOString(),
    };
  
    sendAnalytics("search", searchData);
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
  
export default trackSearch;