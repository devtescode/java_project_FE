const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8090/api';

export const chatAPI = {
  /**
   * POST /api/chat
   * Sends the full conversation history and returns the assistant reply.
   */
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

  /** GET /api/chat/models */
  getModels: async () => {
    const res = await fetch(`${API_BASE}/chat/models`);
    if (!res.ok) throw new Error('Failed to fetch models');
    return res.json();
  },

  /** GET /api/chat/health */
  healthCheck: async () => {
    const res = await fetch(`${API_BASE}/chat/health`);
    return res.ok;
  },
};
