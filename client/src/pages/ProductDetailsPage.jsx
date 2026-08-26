import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";

function ProductDetailsPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  const [selectedVariant, setSelectedVariant] =
    useState(null);

  const [selectedSize, setSelectedSize] =
    useState(null);

  const [selectedImage, setSelectedImage] =
    useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:5001/api/products/${id}`
        );

        const data = await response.json();

        if (data.success) {
          setProduct(data.product);

          // Select first color/variant by default
          if (data.product.variants?.length > 0) {
            const firstVariant =
              data.product.variants[0];

            setSelectedVariant(firstVariant);

            // Select first image by default
            if (firstVariant.images?.length > 0) {
              setSelectedImage(
                firstVariant.images[0].url
              );
            }
          }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error(
          "Error fetching product:",
          error
        );

        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);

    // Reset selected size when color changes
    setSelectedSize(null);

    // Show first image of selected color
    if (variant.images?.length > 0) {
      setSelectedImage(variant.images[0].url);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="mx-auto max-w-7xl text-zinc-500">
          Loading product...
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-zinc-900">
            Product not found
          </h1>

          <Link
            to="/"
            className="mt-4 inline-block text-sm font-semibold text-zinc-700 underline"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Back Button */}
        <Link
          to={`/products/${product.section}`}
          className="mb-8 inline-block text-sm font-medium text-zinc-600 hover:text-black"
        >
          ← Back to {product.section}
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* LEFT SIDE - IMAGES */}
          <div>
            {/* Main Image */}
            <div className="overflow-hidden rounded-2xl bg-zinc-100">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-[500px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[500px] items-center justify-center text-zinc-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {selectedVariant?.images?.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {selectedVariant.images.map(
                  (image, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setSelectedImage(image.url)
                      }
                      className={`h-20 w-20 overflow-hidden rounded-lg border-2 ${
                        selectedImage === image.url
                          ? "border-zinc-900"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDE - PRODUCT DETAILS */}
          <div>

            {/* Brand */}
            <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
              {product.brand}
            </p>

            {/* Product Name */}
            <h1 className="mt-2 text-3xl font-bold text-zinc-900 lg:text-4xl">
              {product.name}
            </h1>

            {/* Category */}
            <p className="mt-3 capitalize text-zinc-500">
              {product.section} •{" "}
              {product.subcategory?.replace(/-/g, " ")}
            </p>

            {/* Price */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-3xl font-bold text-zinc-900">
                ₹{selectedVariant?.sellingPrice}
              </span>

              {selectedVariant?.mrp && (
                <span className="text-lg text-zinc-400 line-through">
                  ₹{selectedVariant.mrp}
                </span>
              )}

              {selectedVariant?.discount > 0 && (
                <span className="rounded-md bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">
                  {selectedVariant.discount}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-zinc-900">
                  Product Description
                </h2>

                <p className="mt-2 leading-7 text-zinc-600">
                  {product.description}
                </p>
              </div>
            )}

            {/* Color Selection */}
            <div className="mt-8">
              <h2 className="text-sm font-bold text-zinc-900">
                Color:{" "}
                <span className="font-normal text-zinc-600">
                  {selectedVariant?.color}
                </span>
              </h2>

              <div className="mt-3 flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() =>
                      handleVariantChange(variant)
                    }
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      selectedVariant?._id ===
                      variant._id
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-300 text-zinc-700 hover:border-zinc-900"
                    }`}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mt-8">
              <h2 className="text-sm font-bold text-zinc-900">
                Select Size
              </h2>

              <div className="mt-3 flex flex-wrap gap-3">
                {selectedVariant?.sizes?.map((sizeItem) => {
                  const isOutOfStock =
                    sizeItem.stock <= 0;

                  return (
                    <button
                      key={sizeItem.size}
                      disabled={isOutOfStock}
                      onClick={() =>
                        setSelectedSize(sizeItem)
                      }
                      className={`min-w-14 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                        selectedSize?.size ===
                        sizeItem.size
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-300 text-zinc-700"
                      } ${
                        isOutOfStock
                          ? "cursor-not-allowed opacity-40"
                          : "hover:border-zinc-900"
                      }`}
                    >
                      {sizeItem.size}
                    </button>
                  );
                })}
              </div>

              {selectedSize && (
                <p className="mt-3 text-sm text-zinc-600">
                  {selectedSize.stock > 0
                    ? `${selectedSize.stock} available in stock`
                    : "Out of Stock"}
                </p>
              )}
            </div>

            {/* Return Policy */}
            <div className="mt-8 rounded-xl bg-zinc-100 p-5">
              <h2 className="font-bold text-zinc-900">
                Return & Exchange
              </h2>

              <p className="mt-2 text-sm text-zinc-600">
                {product.returnPolicy === "returnable" &&
                  "This product is eligible for return and exchange."}

                {product.returnPolicy ===
                  "exchange_only" &&
                  "This product is eligible for exchange only."}

                {product.returnPolicy ===
                  "non_returnable" &&
                  "This product is not eligible for return or exchange."}
              </p>

              {product.returnNote && (
                <p className="mt-2 text-sm text-zinc-500">
                  {product.returnNote}
                </p>
              )}
            </div>

            {/* Add To Cart */}
            <button
              disabled={!selectedSize}
              onClick={() => {
                if (!selectedSize) return;

                addToCart(
                  product,
                  selectedVariant,
                  selectedSize
                );
              }}
              className={`mt-8 w-full rounded-xl px-6 py-4 text-base font-bold transition ${
                selectedSize
                  ? "bg-zinc-900 text-white hover:bg-zinc-700"
                  : "cursor-not-allowed bg-zinc-200 text-zinc-400"
              }`}
            >
              {selectedSize
                ? "Add to Cart"
                : "Select a Size"}
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailsPage;