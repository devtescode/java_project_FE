// const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8090/api';
const API_BASE = process.env.REACT_APP_API_URL || 'javaprojectbe-production.up.railway.app/api';

export const chatAPI = {
  sendMessage: async (messages, model = 'gpt-4o-mini') => {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  getModels: async () => {
    const res = await fetch(`${API_BASE}/chat/models`);
    if (!res.ok) throw new Error('Failed to fetch models');
    return res.json();
  },

  healthCheck: async () => {
    const res = await fetch(`${API_BASE}/chat/health`);
    return res.ok;
  },
};
