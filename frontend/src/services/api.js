const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Lists API
export const listsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/lists`);
    return handleResponse(response);
  },
  create: async (title) => {
    const response = await fetch(`${API_BASE_URL}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    return handleResponse(response);
  },
  update: async (id, title) => {
    const response = await fetch(`${API_BASE_URL}/lists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    return handleResponse(response);
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/lists/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },
  reorder: async (listIds) => {
    const response = await fetch(`${API_BASE_URL}/lists/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listIds })
    });
    return handleResponse(response);
  }
};

// Cards API
export const cardsAPI = {
  getByList: async (listId) => {
    const response = await fetch(`${API_BASE_URL}/cards/list/${listId}`);
    return handleResponse(response);
  },
  create: async (listId, title, description = '') => {
    const response = await fetch(`${API_BASE_URL}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listId, title, description })
    });
    return handleResponse(response);
  },
  update: async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },
  reorder: async (cardIds, listId) => {
    const response = await fetch(`${API_BASE_URL}/cards/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardIds, listId })
    });
    return handleResponse(response);
  }
};
