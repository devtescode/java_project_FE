// const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8090/api';
// const API_BASE = process.env.REACT_APP_API_URL
// export const chatAPI = {
//   sendMessage: async (messages, model = 'gpt-4o-mini') => {
//     const response = await fetch(`${API_BASE}/chat`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ messages, model }),
//     });

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({}));
//       throw new Error(error.message || `HTTP ${response.status}`);
//     }

//     return response.json();
//   },

//   getModels: async () => {
//     const res = await fetch(`${API_BASE}/chat/models`);
//     if (!res.ok) throw new Error('Failed to fetch models');
//     return res.json();
//   },

//   healthCheck: async () => {
//     const res = await fetch(`${API_BASE}/chat/health`);
//     return res.ok;
//   },
// };

// Fallback to localhost during development if REACT_APP_API_URL is not set
// const API_BASE =
//   process.env.REACT_APP_API_URL || "http://localhost:8090/api";
  const API_BASE = process.env.REACT_APP_API_URL

const fetchWithTimeout = async (url, options = {}, timeout = 30000) => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

// Retry request once before failing
const fetchWithRetry = async (url, options, retries = 1) => {
  try {
    return await fetchWithTimeout(url, options);
  } catch (err) {
    if (retries <= 0) throw err;

    console.warn("Request failed. Retrying...");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return fetchWithRetry(url, options, retries - 1);
  }
};

export const chatAPI = {
  sendMessage: async (messages, model = "gpt-4o-mini") => {
    try {
      const response = await fetchWithRetry(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          model,
        }),
      });

      if (!response.ok) {
        let error = {};

        try {
          error = await response.json();
        } catch {}

        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Chat API Error:", err);

      if (err.name === "AbortError") {
        throw new Error(
          "The server took too long to respond. Please try again."
        );
      }

      if (
        err.message === "Failed to fetch" ||
        err.message === "Load failed"
      ) {
        throw new Error(
          "Unable to connect to the server. Please check your internet connection or try again in a few moments."
        );
      }

      throw err;
    }
  },

  getModels: async () => {
    const response = await fetchWithRetry(`${API_BASE}/chat/models`);

    if (!response.ok) {
      throw new Error("Failed to fetch models");
    }

    return response.json();
  },

  healthCheck: async () => {
    try {
      const response = await fetchWithRetry(`${API_BASE}/chat/health`);

      return response.ok;
    } catch {
      return false;
    }
  },
};