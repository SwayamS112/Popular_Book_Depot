import { useEffect, useState } from "react";
import ProductGrid from "../components/product/ProductGrid";
import { getProducts } from "../services/productService";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts();

        setProducts(data.products || []);
      } catch (error) {
        setError(error.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
            Popular Book Depot
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Latest Collection
          </h1>

          <p className="mt-2 text-gray-600">
            Explore our latest products and collections.
          </p>
        </div>

        {loading && (
          <div className="py-20 text-center">
            <p className="text-gray-500">
              Loading products...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <ProductGrid products={products} />
        )}

      </div>
    </main>
  );
}

export default HomePage;