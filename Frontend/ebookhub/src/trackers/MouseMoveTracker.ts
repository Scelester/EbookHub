// src/tracker/MouseMoveTracker.ts
let mouseMoveTimeout: NodeJS.Timeout;

const trackMouseMovement = () => {
  document.addEventListener("mousemove", (event) => {
    const mouseData = {
      x: event.clientX,
      y: event.clientY,
      timestamp: new Date().toISOString(),
    };

    if (mouseMoveTimeout) {
      clearTimeout(mouseMoveTimeout);
    }

    // Send data after user stops moving the mouse for 200ms
    mouseMoveTimeout = setTimeout(() => {
      sendAnalytics("mousemove", mouseData);
    }, 200);
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

export default trackMouseMovement;
