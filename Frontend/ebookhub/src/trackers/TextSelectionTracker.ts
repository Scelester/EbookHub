// src/tracker/TextSelectionTracker.ts
const trackTextSelection = () => {
    document.addEventListener("mouseup", () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const selectedText = selection.toString().trim();
        sendAnalytics("text_selection", { selectedText });
      }
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
  
  export default trackTextSelection;
  