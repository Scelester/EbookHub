
const API_URL = process.env.REACT_APP_API_URL; // Base URL for your API

// Get the access and refresh tokens from localStorage
const getAuthToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

// Helper function to refresh the access token using the refresh token
const refreshAuthToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('Refresh token not available');
  }

  const response = await fetch(`${API_URL}/api/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),  // Adjusted to match expected payload (refresh token)
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Refresh token failed:', errorData);
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();
  // Save new access token
  localStorage.setItem('accessToken', data.access);
  return data.access;
};

// Handle logout
const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.reload();
};

// Helper function to handle API requests that require authentication
export const fetchData = async (endpoint: string, method: string, body?: any) => {
  let token = getAuthToken();  // Get the current access token

  if (!token) {
    throw new Error('Access token not available');
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // If the access token is expired (usually 401 Unauthorized), try refreshing it
  if (response.status === 401) {
    try {
      token = await refreshAuthToken(); // Try to refresh the token
      // Retry the original request with the new access token
      response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      console.error('Session expired or refresh failed:', error);
      // Handle user session expiration
      handleLogout(); // Logout user and clear tokens
      throw new Error('Session expired, please log in again');
    }
  }

  if (!response.ok) {
    const errorData = await response.json();
    console.error('API request failed:', errorData);
    throw new Error(errorData.error || 'Something went wrong');
  }

  // Handle empty response body safely for 204 No Content
  if (response.status === 204) {
    return {};  // Return empty object when there's no content
  }

  return response.json();
};
// Helper function to handle API requests without authentication (for login/signup)
export const fetchDataWithoutAuth = async (endpoint: string, method: string, body?: any) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Request failed:', errorData);
    throw new Error(errorData.error || 'Something went wrong');
  }

  return response.json();
};

// Signup function
export const signup = async (email: string, username: string, password: string, fullName: string, role: string) => {
  return fetchDataWithoutAuth('/signup/', 'POST', { email, username, password, full_name: fullName, role });
};

// Login function
export const login = async (username: string, password: string) => {
  return fetchDataWithoutAuth('/login/', 'POST', { username, password });
};

// Helper function to check if the user is logged in
export const isLoggedIn = (): boolean => {
  return !!getAuthToken();
};
