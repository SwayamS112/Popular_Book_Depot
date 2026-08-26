import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import PopularCollection from "./components/PopularCollection/PopularCollection.jsx";
import CollectionPage from "./pages/CollectionPage.jsx";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AdminLayout from "../src/pages/admin/AdminLayout.jsx"
import AdminDashboard from "../src/pages/admin/AdminDashboard.jsx";
import AdminProducts from "../src/pages/admin/AdminProducts.jsx";
import AdminOrders from "../src/pages/admin/AdminOrders.jsx";
import AdminUsers from "../src/pages/admin/AdminUsers.jsx";

function HomePage() {
  return (
    <>
      <Hero />
      <PopularCollection />
    </>
  );
}

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/products/:section"
          element={<ProductsPage />}
        />

        <Route
          path="/collection/:collectionType"
          element={<CollectionPage />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetailsPage />}
        />

        <Route
            path="/cart"
            element={<CartPage />}
          />

        <Route
            path="/checkout"
            element={<CheckoutPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            path="/my-orders"
            element={<MyOrdersPage />}
          />

          <Route
            path="/my-orders/:id"
            element={<OrderDetailsPage />}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />

          <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;