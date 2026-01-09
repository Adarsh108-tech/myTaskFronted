// lib/api.js
const API_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

export const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
};
