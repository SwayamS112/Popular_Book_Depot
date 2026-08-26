const API_URL = "http://localhost:5001/api/home-sections";

export const getHomeSections = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch home sections");
  }

  return response.json();
};