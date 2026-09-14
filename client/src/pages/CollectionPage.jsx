import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collectionCategories } from "../utils/collectionCategories";
import API_BASE from "../config/api.js";

function CollectionPage() {
  const { collectionType } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSection, setSelectedSection] =
    useState("all");

  const [selectedSubcategory, setSelectedSubcategory] =
    useState("all");

  const [selectedChildCategory, setSelectedChildCategory] =
    useState("all");

  const titles = {
    "most-popular": "Most Popular",
    "best-sellers": "Best Sellers",
    "new-arrivals": "New Arrivals",
  };

  const title =
    titles[collectionType] || "Collection";

  // ==========================================
  // CHANGE MEN / WOMEN / KIDS
  // ==========================================
  const handleSectionChange = (section) => {
    setSelectedSection(section);
    setSelectedSubcategory("all");
    setSelectedChildCategory("all");
  };

  // ==========================================
  // CHANGE FOOTWEAR TYPE
  // ==========================================
  const handleSubcategoryChange = (item) => {
    setSelectedSubcategory(item.value);
    setSelectedChildCategory("all");
  };

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let url =
          `${API_BASE}/api/products?collection=${collectionType}&limit=50`;

        // Men / Women / Kids filter
        if (selectedSection !== "all") {
          url += `&section=${selectedSection}`;
        }

        // Footwear type filter
        if (
          selectedSection !== "all" &&
          selectedSubcategory !== "all"
        ) {
          const selectedItem =
            collectionCategories[
              selectedSection
            ]?.find(
              (item) =>
                item.value === selectedSubcategory
            );

          // Fancy Slippers
          if (selectedItem?.children) {
            // If Heels or Flats is selected,
            // filter by that subcategory
            if (selectedChildCategory !== "all") {
              url += `&subcategory=${selectedChildCategory}`;
            }

            // If All is selected under Fancy Slippers,
            // do not add subcategory filter.
            // This will show all Women's products.
          } else {
            url +=
              `&subcategory=${selectedSubcategory}`;
          }
        }

        const response = await fetch(url);

        const data = await response.json();

        if (data.success) {
          setProducts(data.products || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    collectionType,
    selectedSection,
    selectedSubcategory,
    selectedChildCategory,
  ]);

  // ==========================================
  // GET FANCY SLIPPERS DATA
  // ==========================================
  const fancySlippers =
    collectionCategories.women.find(
      (item) => item.value === "fancy-slippers"
    );

  return (
    <main className="min-h-screen bg-white px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            HEADING
        ====================================== */}
        <p className="text-sm font-semibold tracking-[0.2em] text-zinc-500">
          COLLECTION
        </p>

        <h1 className="mt-2 text-4xl font-bold text-zinc-900">
          {title}
        </h1>

        <p className="mt-3 text-zinc-600">
          Explore our {title.toLowerCase()} footwear
          collection.
        </p>

        {/* ======================================
            MEN / WOMEN / KIDS FILTER
        ====================================== */}
        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold text-zinc-700">
            Shop By
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              {
                label: "All",
                value: "all",
              },
              {
                label: "Men",
                value: "men",
              },
              {
                label: "Women",
                value: "women",
              },
              {
                label: "Kids",
                value: "kids",
              },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() =>
                  handleSectionChange(item.value)
                }
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  selectedSection === item.value
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ======================================
            FOOTWEAR TYPE FILTER
        ====================================== */}
        {selectedSection !== "all" &&
          collectionCategories[selectedSection] && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-zinc-700">
                Footwear Type
              </p>

              <div className="flex flex-wrap gap-3">

                {/* All */}
                <button
                  onClick={() => {
                    setSelectedSubcategory("all");
                    setSelectedChildCategory("all");
                  }}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    selectedSubcategory === "all"
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  All
                </button>

                {/* Categories */}
                {collectionCategories[
                  selectedSection
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() =>
                      handleSubcategoryChange(item)
                    }
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      selectedSubcategory ===
                      item.value
                        ? "bg-zinc-900 text-white"
                        : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* ======================================
            FANCY SLIPPERS -> HEELS / FLATS
        ====================================== */}
        {selectedSection === "women" &&
          selectedSubcategory ===
            "fancy-slippers" &&
          fancySlippers?.children && (
            <div className="mt-5">
              <p className="mb-3 text-sm font-semibold text-zinc-700">
                Select Style
              </p>

              <div className="flex flex-wrap gap-3">

                {/* All Fancy Slippers */}
                <button
                  onClick={() =>
                    setSelectedChildCategory("all")
                  }
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    selectedChildCategory === "all"
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  All
                </button>

                {/* Heels / Flats */}
                {fancySlippers.children.map(
                  (child) => (
                    <button
                      key={child.value}
                      onClick={() =>
                        setSelectedChildCategory(
                          child.value
                        )
                      }
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        selectedChildCategory ===
                        child.value
                          ? "bg-zinc-900 text-white"
                          : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {child.label}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

        {/* ======================================
            LOADING
        ====================================== */}
        {loading && (
          <p className="mt-12 text-zinc-500">
            Loading products...
          </p>
        )}

        {/* ======================================
            NO PRODUCTS
        ====================================== */}
        {!loading && products.length === 0 && (
          <div className="mt-12 rounded-xl border border-zinc-200 p-10 text-center">
            <h2 className="text-xl font-semibold text-zinc-900">
              No products found
            </h2>

            <p className="mt-2 text-zinc-500">
              No products are currently available with
              these filters.
            </p>
          </div>
        )}

        {/* ======================================
            PRODUCTS
        ====================================== */}
        {!loading && products.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const firstVariant =
                product.variants?.[0];

              const firstImage =
                firstVariant?.images?.[0]?.url;

              return (
                <Link
                    to={`/product/${product._id}`}
                    key={product._id}
                    className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:shadow-lg"
                    >
                  {/* Product Image */}
                  <div className="h-64 bg-zinc-100">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      {product.brand}
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-zinc-900">
                      {product.name}
                    </h2>

                    <p className="mt-1 text-sm capitalize text-zinc-500">
                      {product.section} •{" "}
                      {product.subcategory?.replace(
                        /-/g,
                        " "
                      )}
                    </p>

                    {/* Price */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-lg font-bold text-zinc-900">
                        ₹
                        {firstVariant?.sellingPrice ??
                          "N/A"}
                      </span>

                      {firstVariant?.mrp && (
                        <span className="text-sm text-zinc-400 line-through">
                          ₹{firstVariant.mrp}
                        </span>
                      )}
                    </div>

                    {/* Stock */}
                    {!product.inStock && (
                      <p className="mt-2 text-sm font-medium text-red-500">
                        Out of Stock
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default CollectionPage;