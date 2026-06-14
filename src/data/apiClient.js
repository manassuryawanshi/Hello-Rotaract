const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

export const apiClient = {
  getToken: () => {
    const sessionStr = localStorage.getItem('hr_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        // Supabase session object usually has session.session.access_token or we stored it in authData.session
        return session.session?.access_token || null;
      } catch (err) {
        return null;
      }
    }
    return null;
  },

  request: async (endpoint, options = {}) => {
    const token = apiClient.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || 'API Request Failed');
    }

    return data;
  },

  get: (endpoint) => apiClient.request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiClient.request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint, body) => apiClient.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => apiClient.request(endpoint, { method: 'DELETE' }),
};
