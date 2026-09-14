import { useContext, useEffect, useState } from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import API_BASE from "../config/api.js";

function LoginPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const {
    login,
    isAuthenticated,
    user,
  } = useContext(AuthContext);

  const { mergeGuestCart } =
    useContext(CartContext);

  // Get redirect URL from:
  // /login?redirect=/checkout
  const redirectTo =
    searchParams.get("redirect") || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate(redirectTo, {
          replace: true,
        });
      }
    }
  }, [
    isAuthenticated,
    user,
    navigate,
    redirectTo,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password"
        );
      }

      // Save user and token
      login(data.user, data.token);

      // =====================================
      // ADMIN LOGIN
      // =====================================
      if (data.user.role === "admin") {
        navigate("/admin", {
          replace: true,
        });

        return;
      }

      // =====================================
      // CUSTOMER LOGIN
      // =====================================

      // Merge guest cart into logged-in user's cart
      await mergeGuestCart(data.token);

      // Redirect customer
      navigate(redirectTo, {
        replace: true,
      });

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">

          {/* Heading */}
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.2em] text-zinc-500">
              WELCOME BACK
            </p>

            <h1 className="mt-2 text-3xl font-bold text-zinc-900">
              Login to your account
            </h1>

            <p className="mt-3 text-sm text-zinc-600">
              Login to continue shopping and manage your cart.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-zinc-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-zinc-600">
            Don't have an account?{" "}
            <Link
              to={`/register?redirect=${encodeURIComponent(
                redirectTo
              )}`}
              className="font-semibold text-zinc-900 hover:underline"
            >
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}

export default LoginPage;