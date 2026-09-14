import API_BASE from "../config/api.js";

const API_URL = `${API_BASE}/api/home-sections`;

export const getHomeSections = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch home sections");
  }

  return response.json();
};