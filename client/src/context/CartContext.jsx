import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { AuthContext } from "./AuthContext.jsx";

export const CartContext = createContext();

const API_URL = "http://localhost:5001/api";

export function CartProvider({ children }) {

  
  const {
    isAuthenticated,
    token,
  } = useContext(AuthContext);
  
  // Guest cart
  const [cartItems, setCartItems] = useState(() => {
    const savedCart =
    localStorage.getItem("cart");
    
    return savedCart
    ? JSON.parse(savedCart)
    : [];
  });
  
  const [cartLoading, setCartLoading] =
  useState(false);
  
  const previousAuthState = useRef(isAuthenticated);
  
  // =====================================
  // CONVERT BACKEND CART TO FRONTEND CART
  // =====================================
  const formatCartItems = (items = []) => {
    return items
      .filter((item) => item.product)
      .map((item) => {
        const product = item.product;

        const variant = product.variants?.find(
          (variantItem) =>
            variantItem.color?.toLowerCase() ===
            item.color?.toLowerCase()
        );

        const sizeItem = variant?.sizes?.find(
          (sizeData) =>
            String(sizeData.size) ===
            String(item.size)
        );

        return {
          // IMPORTANT:
          // This is the MongoDB Cart item ID
          cartItemId: item._id,

          productId: product._id,

          // Backend cart does not require variantId,
          // but we keep it for frontend compatibility
          variantId: variant?._id || "",

          name: product.name,
          brand: product.brand,

          section: product.section,
          subcategory: product.subcategory,

          color: item.color,
          size: item.size,

          image:
            variant?.images?.[0]?.url || "",

          mrp: variant?.mrp || 0,

          sellingPrice:
            variant?.sellingPrice || 0,

          discount:
            variant?.discount || 0,

          stock:
            sizeItem?.stock || 0,

          quantity: item.quantity,
        };
      });
  };

  // =====================================
  // GET BACKEND CART
  // =====================================
  const fetchCart = async () => {
    if (!token) return;

    try {
      setCartLoading(true);

      const response = await fetch(
        `${API_URL}/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch cart"
        );
      }

      const formattedItems =
        formatCartItems(
          data.cart?.items || []
        );

      setCartItems(formattedItems);
    } catch (error) {
      console.error(
        "Error fetching cart:",
        error
      );
    } finally {
      setCartLoading(false);
    }
  };


  // =====================================
// CLEAR USER CART ON LOGOUT
// =====================================
useEffect(() => {
  // User was logged in and has now logged out
  if (
    previousAuthState.current === true &&
    isAuthenticated === false
  ) {
    // Clear previous user's cart from state
    setCartItems([]);

    // Remove previous user's cart from local storage
    localStorage.removeItem("cart");
  }

  // Update previous authentication state
  previousAuthState.current = isAuthenticated;
}, [isAuthenticated]);

  // =====================================
  // MERGE GUEST CART AFTER LOGIN
  // =====================================
  const mergeGuestCart = async (
    guestItems
  ) => {
    if (
      !token ||
      !Array.isArray(guestItems) ||
      guestItems.length === 0
    ) {
      return;
    }

    const itemsToMerge = guestItems.map(
      (item) => ({
        productId: item.productId,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
      })
    );

    const response = await fetch(
      `${API_URL}/cart/merge`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          items: itemsToMerge,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Failed to merge guest cart"
      );
    }

    return data.cart;
  };

  // =====================================
  // WHEN USER LOGS IN
  // =====================================
  useEffect(() => {
    const syncCart = async () => {
      if (!isAuthenticated || !token) {
        return;
      }

      try {
        // Get current guest cart from localStorage
        const savedCart =
          localStorage.getItem("cart");

        const guestItems = savedCart
          ? JSON.parse(savedCart)
          : [];

        // Merge guest items if they exist
        if (guestItems.length > 0) {
          const mergedCart =
            await mergeGuestCart(
              guestItems
            );

          const formattedItems =
            formatCartItems(
              mergedCart?.items || []
            );

          setCartItems(
            formattedItems
          );

          // Clear guest/local cart after successful merge
          localStorage.removeItem(
            "cart"
          );
        } else {
          // Otherwise load normal backend cart
          await fetchCart();
        }
      } catch (error) {
        console.error(
          "Error syncing cart:",
          error
        );

        // If merge fails, still try fetching
        await fetchCart();
      }
    };

    syncCart();
  }, [
    isAuthenticated,
    token,
  ]);

  // =====================================
  // SAVE GUEST CART ONLY
  // =====================================
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(
        "cart",
        JSON.stringify(cartItems)
      );
    }
  }, [
    cartItems,
    isAuthenticated,
  ]);

  // =====================================
  // ADD TO CART
  // =====================================
  const addToCart = async (
    product,
    variant,
    sizeItem
  ) => {
    // -----------------------------
    // GUEST CART
    // -----------------------------
    if (!isAuthenticated) {
      const existingItemIndex =
        cartItems.findIndex(
          (item) =>
            item.productId ===
              product._id &&
            item.color.toLowerCase() ===
              variant.color.toLowerCase() &&
            String(item.size) ===
              String(sizeItem.size)
        );

      if (existingItemIndex !== -1) {
        setCartItems(
          (currentItems) =>
            currentItems.map(
              (item, index) =>
                index ===
                existingItemIndex
                  ? {
                      ...item,

                      quantity:
                        Math.min(
                          item.quantity +
                            1,
                          sizeItem.stock
                        ),
                    }
                  : item
            )
        );

        return;
      }

      const newItem = {
        productId: product._id,
        variantId: variant._id,

        name: product.name,
        brand: product.brand,

        section:
          product.section,

        subcategory:
          product.subcategory,

        color: variant.color,
        size: sizeItem.size,

        image:
          variant.images?.[0]
            ?.url || "",

        mrp: variant.mrp,

        sellingPrice:
          variant.sellingPrice,

        discount:
          variant.discount,

        stock: sizeItem.stock,

        quantity: 1,
      };

      setCartItems(
        (currentItems) => [
          ...currentItems,
          newItem,
        ]
      );

      return;
    }

    // -----------------------------
    // LOGGED-IN USER
    // -----------------------------
    try {
      const response = await fetch(
        `${API_URL}/cart`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            productId: product._id,
            color: variant.color,
            size: sizeItem.size,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to add product"
        );
      }

      setCartItems(
        formatCartItems(
          data.cart?.items || []
        )
      );
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error
      );

      throw error;
    }
  };

  // =====================================
  // REMOVE FROM CART
  // =====================================
  const removeFromCart = async (
    productId,
    variantId,
    size,
    cartItemId
  ) => {
    // -----------------------------
    // GUEST CART
    // -----------------------------
    if (!isAuthenticated) {
      setCartItems(
        (currentItems) =>
          currentItems.filter(
            (item) =>
              !(
                item.productId ===
                  productId &&
                item.variantId ===
                  variantId &&
                String(item.size) ===
                  String(size)
              )
          )
      );

      return;
    }

    // -----------------------------
    // LOGGED-IN USER
    // -----------------------------
    try {
      if (!cartItemId) {
        throw new Error(
          "Cart item ID is missing"
        );
      }

      const response = await fetch(
        `${API_URL}/cart/${cartItemId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Cart item not found"
        );
      }

      setCartItems(
        formatCartItems(
          data.cart?.items || []
        )
      );
    } catch (error) {
      console.error(
        "Error removing cart item:",
        error
      );

      throw error;
    }
  };

  // =====================================
  // UPDATE QUANTITY
  // =====================================
  const updateQuantity = async (
    productId,
    variantId,
    size,
    quantity,
    cartItemId
  ) => {
    // -----------------------------
    // GUEST CART
    // -----------------------------
    if (!isAuthenticated) {
      setCartItems(
        (currentItems) =>
          currentItems.map(
            (item) => {
              if (
                item.productId ===
                  productId &&
                item.variantId ===
                  variantId &&
                String(item.size) ===
                  String(size)
              ) {
                const newQuantity =
                  Math.max(
                    1,
                    Math.min(
                      Number(quantity),
                      item.stock
                    )
                  );

                return {
                  ...item,
                  quantity:
                    newQuantity,
                };
              }

              return item;
            }
          )
      );

      return;
    }

    // -----------------------------
    // LOGGED-IN USER
    // -----------------------------
    try {
      if (!cartItemId) {
        throw new Error(
          "Cart item ID is missing"
        );
      }

      const response = await fetch(
        `${API_URL}/cart/${cartItemId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            quantity:
              Number(quantity),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Cart item not found"
        );
      }

      setCartItems(
        formatCartItems(
          data.cart?.items || []
        )
      );
    } catch (error) {
      console.error(
        "Error updating quantity:",
        error
      );

      throw error;
    }
  };

  // =====================================
  // CLEAR CART
  // =====================================
  const clearCart = () => {
    if (!isAuthenticated) {
      setCartItems([]);

      localStorage.removeItem(
        "cart"
      );

      return;
    }

    // For now clear frontend.
    // We can add a backend clear-cart API later.
    setCartItems([]);
  };

  // =====================================
  // TOTAL ITEMS
  // =====================================
  const totalItems =
    cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  // =====================================
  // TOTAL PRICE
  // =====================================
  const totalPrice =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(
          item.sellingPrice || 0
        ) *
          item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cartItems,

        cartLoading,

        addToCart,

        removeFromCart,

        updateQuantity,

        clearCart,

        fetchCart,

        totalItems,

        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}