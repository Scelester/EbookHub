// src/services/apiService.ts
const API_URL = 'http://localhost:8000'; // Base URL for your API

// Helper function to handle fetching
const fetchData = async (endpoint: string, method: string, body?: any) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Something went wrong');
  }

  return response.json();
};

// Signup function
// Update the signup function to include fullName
export const signup = async (email: string, username: string, password: string, fullName: string, role: string) => {
  return fetchData('/signup/', 'POST', { email, username, password, full_name: fullName, role }); // Include full_name
};

// Login function
export const login = async (username: string, password: string) => {
  return fetchData('/login/', 'POST', { username, password });
};


