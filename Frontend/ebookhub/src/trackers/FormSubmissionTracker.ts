// src/tracker/FormSubmissionTracker.ts
const trackFormSubmission = (formId: string, formData: object) => {
    const formSubmissionData = {
      formId,
      formData,
      timestamp: new Date().toISOString(),
    };
  
    sendAnalytics("form_submission", formSubmissionData);
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
  
  export default trackFormSubmission;
  