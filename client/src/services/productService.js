import API_BASE from "../config/api.js";

const API_URL = `${API_BASE}/api/products`;

export const getProducts = async () => {
  try {
    const response = await fetch(API_URL);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch products"
      );
    }

    return data;
  } catch (error) {
    console.error("Product API Error:", error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await fetch(
      `${API_URL}/${productId}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch product"
      );
    }

    return data;
  } catch (error) {
    console.error("Product API Error:", error);
    throw error;
  }
};