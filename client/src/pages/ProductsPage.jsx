import { useEffect, useState } from "react";

import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";

import {
  collectionCategories,
  getCategoryByValue,
  getParentCategoryByChildValue,
} from "../data/collectionCategories";

import API_BASE from "../config/api.js";

function ProductsPage() {
  const { section } = useParams();

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  // Get category from URL
  const urlSubcategory =
    searchParams.get("subcategory") || "all";

  // Get child category from URL
  const urlChildCategory =
    searchParams.get("childCategory") || "all";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSubcategory, setSelectedSubcategory] =
    useState(urlSubcategory);

  const [
    selectedChildCategory,
    setSelectedChildCategory,
  ] = useState(urlChildCategory);

  const sectionTitles = {
    men: "Men's Footwear",
    women: "Women's Footwear",
    kids: "Kids Footwear",
    accessories: "Accessories",
  };

  const title =
    sectionTitles[section] || "Products";

  const categories =
    collectionCategories[section] || [];

  // ==========================================
  // SYNC URL CATEGORY WITH STATE
  // ==========================================
  useEffect(() => {
    let newSubcategory = urlSubcategory;
    let newChildCategory = urlChildCategory;

    /*
      If the URL directly contains:
      ?subcategory=heels

      Automatically find that heels belongs
      inside fancy-slippers.
    */
    if (
      urlSubcategory !== "all" &&
      urlChildCategory === "all"
    ) {
      const parentCategory =
        getParentCategoryByChildValue(
          section,
          urlSubcategory
        );

      if (parentCategory) {
        newSubcategory =
          parentCategory.value;

        newChildCategory =
          urlSubcategory;
      }
    }

    setSelectedSubcategory(newSubcategory);
    setSelectedChildCategory(newChildCategory);
  }, [
    section,
    urlSubcategory,
    urlChildCategory,
  ]);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let url =
          `${API_BASE}/api/products?section=${section}&limit=50`;

        /*
          If a child category is selected,
          filter by the child category.
          
          Example:
          fancy-slippers + heels
          sends subcategory=heels
        */
        if (
          selectedChildCategory !== "all"
        ) {
          url +=
            `&subcategory=${selectedChildCategory}`;
        } else if (
          selectedSubcategory !== "all"
        ) {
          url +=
            `&subcategory=${selectedSubcategory}`;
        }

        const response = await fetch(url);

        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
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
    section,
    selectedSubcategory,
    selectedChildCategory,
  ]);

  // ==========================================
  // HANDLE MAIN CATEGORY CLICK
  // ==========================================
  const handleCategoryClick = (category) => {
    setSelectedSubcategory(category.value);

    // Reset child category
    setSelectedChildCategory("all");

    navigate(
      `/products/${section}?subcategory=${category.value}`
    );
  };

  // ==========================================
  // HANDLE CHILD CATEGORY CLICK
  // ==========================================
  const handleChildCategoryClick = (child) => {
    setSelectedChildCategory(child.value);

    navigate(
      `/products/${section}?subcategory=${selectedSubcategory}&childCategory=${child.value}`
    );
  };

  // ==========================================
  // HANDLE ALL CLICK
  // ==========================================
  const handleAllClick = () => {
    setSelectedSubcategory("all");
    setSelectedChildCategory("all");

    navigate(`/products/${section}`);
  };

  // ==========================================
  // GET CURRENT CATEGORY
  // ==========================================
  const selectedCategory = getCategoryByValue(
    section,
    selectedSubcategory
  );

  return (
    <main className="min-h-screen bg-white px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <p className="text-sm font-semibold tracking-[0.2em] text-zinc-500">
          SHOP
        </p>

        <h1 className="mt-2 text-4xl font-bold text-zinc-900">
          {title}
        </h1>

        <p className="mt-3 text-zinc-600">
          Explore our latest {section} footwear collection.
        </p>

        {/* Main Categories */}
        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold text-zinc-700">
            Footwear Type
          </p>

          <div className="flex flex-wrap gap-3">

            {/* All */}
            <button
              onClick={handleAllClick}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                selectedSubcategory === "all"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              All
            </button>

            {/* Categories */}
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() =>
                  handleCategoryClick(category)
                }
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  selectedSubcategory === category.value
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Child Categories - Heels / Flats */}
        {selectedCategory?.children && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-zinc-700">
              Choose Type
            </p>

            <div className="flex flex-wrap gap-3">

              {/* All Fancy Slippers */}
              <button
                onClick={() => {
                  setSelectedChildCategory("all");

                  navigate(
                    `/products/${section}?subcategory=${selectedSubcategory}`
                  );
                }}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedChildCategory === "all"
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                All
              </button>

              {/* Heels / Flats */}
              {selectedCategory.children.map(
                (child) => (
                  <button
                    key={child.value}
                    onClick={() =>
                      handleChildCategoryClick(child)
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

        {/* Kids Age to Size Button */}
        {section === "kids" && (
          <div className="mt-8 rounded-2xl bg-zinc-100 p-6">
            <h2 className="text-xl font-bold text-zinc-900">
              Not sure about the right shoe size?
            </h2>

            <p className="mt-2 text-sm text-zinc-600">
              Check our Age to Size guide to help you
              choose the right size for your child.
            </p>

            <button
              onClick={() =>
                navigate("/kids-age-to-size")
              }
              className="mt-4 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Age to Size Guide
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <p className="mt-12 text-zinc-500">
            Loading products...
          </p>
        )}

        {/* No Products */}
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

        {/* Products */}
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
                      {product.subcategory?.replace(
                        /-/g,
                        " "
                      )}
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-lg font-bold text-zinc-900">
                        ₹{firstVariant?.sellingPrice}
                      </span>

                      {firstVariant?.mrp && (
                        <span className="text-sm text-zinc-400 line-through">
                          ₹{firstVariant.mrp}
                        </span>
                      )}
                    </div>

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

export default ProductsPage;