import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

import Hero from "./components/Hero/Hero.jsx";
import ShopByCategory from "./components/ShopByCategory/ShopByCategory.jsx";
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
import EveryMoment from "./components/EveryMoment/EveryMoment.jsx";
import WhyChooseUs from "./components/WhyChooseUs/WhyChooseUs.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminHome from "./pages/admin/AdminHome.jsx";

function HomePage() {
  return (
    <>
      <Hero />
      <ShopByCategory />
      <PopularCollection />
       <WhyChooseUs />
      <EveryMoment />
    </>
  );
}

function AppContent() {
  const location = useLocation();

  const isAdminRoute =
    location.pathname.startsWith("/admin");

  return (
    <>
      {/* Customer Header is hidden inside Admin Panel */}
      {!isAdminRoute && <Header />}

      <Routes>
        {/* ================= CUSTOMER ================= */}

        <Route
          path="/"
          element={<HomePage />}
        />

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

        {/* ================= ADMIN ================= */}

        <Route element={<AdminRoute />}>
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route
              index
              element={<AdminDashboard />}
            />

            <Route
              path="products"
              element={<AdminProducts />}
            />

            <Route
              path="orders"
              element={<AdminOrders />}
            />

            <Route
              path="users"
              element={<AdminUsers />}
            />

            <Route
              path="home"
              element={<AdminHome />}
            />
          </Route>
        </Route>
      </Routes>
      {/* CUSTOMER FOOTER */}

      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;