// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    API_URL,
    MODE: import.meta.env.MODE,
  });
}

/**
 * API client with automatic authentication
 */
export async function apiClient(endpoint, options = {}) {
  const { requiresAuth = true, ...restOptions } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...restOptions.headers,
  };

  // Add authentication token if required
  if (requiresAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  // Log request in development
  if (import.meta.env.DEV) {
    console.log('📡 API Request:', {
      method: restOptions.method || 'GET',
      url,
      requiresAuth,
    });
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers,
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'include', // Include credentials for CORS
    });

    // Handle expired/invalid token
    if (response.status === 401 && requiresAuth) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    return response;
  } catch (error) {
    console.error('❌ API Request Failed:', {
      url,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

/**
 * Convenience methods for API calls
 */
export const api = {
  get: (endpoint, options) =>
    apiClient(endpoint, { ...options, method: 'GET' }),

  post: (endpoint, data, options) =>
    apiClient(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: (endpoint, data, options) =>
    apiClient(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (endpoint, options) =>
    apiClient(endpoint, { ...options, method: 'DELETE' }),
};

