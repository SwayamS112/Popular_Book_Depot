function ProductCard({ product }) {
  const variant = product.variants?.[0];

  const image =
    variant?.images?.[0]?.url ||
    "https://via.placeholder.com/400x500?text=No+Image";

  return (
    <article className="group overflow-hidden rounded-2xl bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      
      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* New Arrival Badge */}
        {product.isNewArrival && (
          <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
            New Arrival
          </span>
        )}

        {/* Discount Badge */}
        {variant?.discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-red-600 shadow-sm">
            {variant.discount}% OFF
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4">
        <p className="text-sm font-medium text-gray-500">
          {product.brand}
        </p>

        <h3 className="mt-1 truncate text-base font-semibold text-gray-900">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{variant?.sellingPrice}
          </span>

          {variant?.mrp > variant?.sellingPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{variant.mrp}
            </span>
          )}
        </div>

        {/* Stock */}
        <p
          className={`mt-3 text-sm font-medium ${
            product.inStock
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </p>
      </div>
    </article>
  );
}

export default ProductCard;