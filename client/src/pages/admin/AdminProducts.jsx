import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

const API_BASE = "http://localhost:5001";

const CATEGORY_OPTIONS = {
  men: ["sports-shoes", "formal-shoes", "sneakers", "sandals", "home-slippers"],
  women: ["sports-shoes", "formal-shoes", "heels", "sneakers", "sandals", "home-slippers"],
  kids: ["sports-shoes", "school-shoes", "sneakers", "sandals", "home-slippers"],
  accessories: ["general"],
};

const emptySize = () => ({
  _localId: `size-${Date.now()}-${Math.random()}`,
  size: "",
  stock: 0,
});

const emptyVariant = () => ({
  _localId: `variant-${Date.now()}-${Math.random()}`,
  color: "",
  images: [],
  sizes: [emptySize()],
  mrp: "",
  sellingPrice: "",
  discount: "",
});

const emptyForm = {
  name: "",
  brand: "",
  section: "men",
  category: "shoes",
  subcategory: "sports-shoes",
  description: "",
  variants: [emptyVariant()],
  returnPolicy: "returnable",
  returnNote: "",
  isActive: true,
  isFeatured: false,
  isPopular: false,
  isBestSeller: false,
  isNewArrival: true,
};

function AdminProducts() {
  const { token } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [message, setMessage] = useState({ type: "", text: "" });

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const loadProducts = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/products/admin/all?limit=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load products.");
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Admin products load error:", error);
      setMessage({
        type: "error",
        text: error.message || "Unable to load products.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadProducts();
    }
  }, [token]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.subcategory?.toLowerCase().includes(query);

      const matchesSection =
        sectionFilter === "all" || product.section === sectionFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product.isActive) ||
        (statusFilter === "inactive" && !product.isActive);

      return matchesSearch && matchesSection && matchesStatus;
    });
  }, [products, search, sectionFilter, statusFilter]);

  const resetForm = () => {
    setEditingId(null);
    setIsCreating(false);
    setForm(emptyForm);
  };

  const openCreate = () => {
    setEditingId(null);
    setIsCreating(true);
    setForm(emptyForm);
    setMessage({ type: "", text: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (product) => {
    setIsCreating(false);
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      brand: product.brand || "",
      section: product.section || "men",
      category: product.category || "shoes",
      subcategory:
        product.subcategory ||
        CATEGORY_OPTIONS[product.section]?.[0] ||
        "sports-shoes",
      description: product.description || "",
      variants:
        product.variants?.map((variant) => ({
          _localId: variant._id || `variant-${Date.now()}-${Math.random()}`,
          _id: variant._id,
          color: variant.color || "",
          images: variant.images || [],
          sizes:
            variant.sizes?.map((size) => ({
              _localId: `size-${variant._id}-${size.size}`,
              size: size.size || "",
              stock: size.stock ?? 0,
            })) || [emptySize()],
          mrp: variant.mrp ?? "",
          sellingPrice: variant.sellingPrice ?? "",
          discount: variant.discount ?? "",
        })) || [emptyVariant()],
      returnPolicy: product.returnPolicy || "returnable",
      returnNote: product.returnNote || "",
      isActive: product.isActive !== false,
      isFeatured: Boolean(product.isFeatured),
      isPopular: Boolean(product.isPopular),
      isBestSeller: Boolean(product.isBestSeller),
      isNewArrival: product.isNewArrival !== false,
    });

    setMessage({ type: "", text: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "section"
        ? {
            category: value === "accessories" ? "accessories" : "shoes",
            subcategory: CATEGORY_OPTIONS[value]?.[0] || "general",
          }
        : {}),
    }));
  };

  const updateVariant = (variantIndex, field, value) => {
    setForm((previous) => ({
      ...previous,
      variants: previous.variants.map((variant, index) =>
        index === variantIndex
          ? { ...variant, [field]: value }
          : variant
      ),
    }));
  };

  const addVariant = () => {
    setForm((previous) => ({
      ...previous,
      variants: [...previous.variants, emptyVariant()],
    }));
  };

  const removeVariant = (variantIndex) => {
    if (form.variants.length === 1) {
      setMessage({
        type: "error",
        text: "A product must have at least one variant.",
      });
      return;
    }

    setForm((previous) => ({
      ...previous,
      variants: previous.variants.filter(
        (_, index) => index !== variantIndex
      ),
    }));
  };

  const updateSize = (variantIndex, sizeIndex, field, value) => {
    setForm((previous) => ({
      ...previous,
      variants: previous.variants.map((variant, vIndex) =>
        vIndex === variantIndex
          ? {
              ...variant,
              sizes: variant.sizes.map((size, sIndex) =>
                sIndex === sizeIndex
                  ? { ...size, [field]: value }
                  : size
              ),
            }
          : variant
      ),
    }));
  };

  const addSize = (variantIndex) => {
    setForm((previous) => ({
      ...previous,
      variants: previous.variants.map((variant, index) =>
        index === variantIndex
          ? { ...variant, sizes: [...variant.sizes, emptySize()] }
          : variant
      ),
    }));
  };

  const removeSize = (variantIndex, sizeIndex) => {
    const variant = form.variants[variantIndex];

    if (variant.sizes.length === 1) {
      setMessage({
        type: "error",
        text: "Each variant must have at least one size.",
      });
      return;
    }

    setForm((previous) => ({
      ...previous,
      variants: previous.variants.map((item, index) =>
        index === variantIndex
          ? {
              ...item,
              sizes: item.sizes.filter((_, sIndex) => sIndex !== sizeIndex),
            }
          : item
      ),
    }));
  };

  const uploadVariantImage = async (event, variantIndex) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const uploadKey = `${form.variants[variantIndex]._localId}`;
    setUploadingKey(uploadKey);
    setMessage({ type: "", text: "" });

    try {
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append(
        "folder",
        `popular-footwear/products/${editingId || "new"}`
      );

      const response = await fetch(`${API_BASE}/api/admin/media/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadForm,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Image upload failed.");
      }

      setForm((previous) => ({
        ...previous,
        variants: previous.variants.map((variant, index) =>
          index === variantIndex
            ? {
                ...variant,
                images: [
                  ...variant.images,
                  {
                    url: data.media.url,
                    publicId: data.media.publicId,
                  },
                ],
              }
            : variant
        ),
      }));

      setMessage({
        type: "success",
        text: "Image uploaded. Save the product to apply it.",
      });
    } catch (error) {
      console.error("Product image upload error:", error);
      setMessage({
        type: "error",
        text: error.message || "Image upload failed.",
      });
    } finally {
      setUploadingKey("");
      event.target.value = "";
    }
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    setForm((previous) => ({
      ...previous,
      variants: previous.variants.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              images: variant.images.filter(
                (_, currentIndex) => currentIndex !== imageIndex
              ),
            }
          : variant
      ),
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Product name is required.";
    if (!form.brand.trim()) return "Brand is required.";
    if (!form.subcategory) return "Subcategory is required.";
    if (!form.variants.length) return "At least one variant is required.";

    for (let index = 0; index < form.variants.length; index += 1) {
      const variant = form.variants[index];

      if (!variant.color.trim()) {
        return `Color is required for Variant ${index + 1}.`;
      }

      if (!variant.images.length) {
        return `Add at least one image for Variant ${index + 1}.`;
      }

      if (!variant.sizes.length) {
        return `Add at least one size for Variant ${index + 1}.`;
      }

      if (variant.mrp === "" || Number(variant.mrp) < 0) {
        return `Enter a valid MRP for Variant ${index + 1}.`;
      }

      if (
        variant.sellingPrice === "" ||
        Number(variant.sellingPrice) < 0
      ) {
        return `Enter a valid selling price for Variant ${index + 1}.`;
      }

      if (Number(variant.sellingPrice) > Number(variant.mrp)) {
        return `Selling price cannot be greater than MRP for Variant ${
          index + 1
        }.`;
      }

      for (const size of variant.sizes) {
        if (!String(size.size).trim()) {
          return `Every size must have a value in Variant ${index + 1}.`;
        }

        if (Number(size.stock) < 0) {
          return `Stock cannot be negative in Variant ${index + 1}.`;
        }
      }
    }

    return "";
  };

  const saveProduct = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      section: form.section,
      category: form.category,
      subcategory: form.subcategory,
      description: form.description.trim(),
      variants: form.variants.map((variant) => ({
        ...(variant._id ? { _id: variant._id } : {}),
        color: variant.color.trim(),
        images: variant.images,
        sizes: variant.sizes.map((size) => ({
          size: String(size.size).trim(),
          stock: Number(size.stock) || 0,
        })),
        mrp: Number(variant.mrp),
        sellingPrice: Number(variant.sellingPrice),
        discount:
          variant.discount === "" ? 0 : Number(variant.discount),
      })),
      returnPolicy: form.returnPolicy,
      returnNote: form.returnNote.trim(),
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      isPopular: form.isPopular,
      isBestSeller: form.isBestSeller,
      isNewArrival: form.isNewArrival,
    };

    try {
      const endpoint = editingId
        ? `${API_BASE}/api/products/${editingId}`
        : `${API_BASE}/api/products`;

      const response = await fetch(endpoint, {
        method: editingId ? "PUT" : "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save product.");
      }

      setMessage({
        type: "success",
        text: editingId
          ? "Product updated successfully."
          : "Product created successfully.",
      });

      resetForm();
      await loadProducts();
    } catch (error) {
      console.error("Save product error:", error);
      setMessage({
        type: "error",
        text: error.message || "Unable to save product.",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleProduct = async (product) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/products/${product._id}`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            isActive: !product.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update product status.");
      }

      await loadProducts();

      setMessage({
        type: "success",
        text: product.isActive
          ? "Product hidden from the storefront."
          : "Product is now active on the storefront.",
      });
    } catch (error) {
      console.error("Product status error:", error);
      setMessage({
        type: "error",
        text: error.message || "Unable to update product status.",
      });
    }
  };

  const activeCount = products.filter((product) => product.isActive).length;
  const inactiveCount = products.length - activeCount;

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">
            Inventory
          </p>

          <h2 className="mt-3 font-['Outfit'] text-4xl font-extrabold tracking-[-0.04em] text-zinc-950">
            Products
          </h2>

          <p className="mt-3 text-sm text-zinc-500">
            Manage footwear, variants, pricing, images and stock.
          </p>
        </div>

        {!editingId && !isCreating && (
          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700"
          >
            + Add Product
          </button>
        )}
      </div>

      {message.text && (
        <div
          className={`mt-6 rounded-2xl border px-5 py-4 text-sm font-semibold ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {editingId || isCreating ? (
        <ProductEditor
          form={form}
          setForm={setForm}
          editingId={editingId}
          saving={saving}
          uploadingKey={uploadingKey}
          onCancel={resetForm}
          onSave={saveProduct}
          onFieldChange={handleFieldChange}
          onUpdateVariant={updateVariant}
          onAddVariant={addVariant}
          onRemoveVariant={removeVariant}
          onUpdateSize={updateSize}
          onAddSize={addSize}
          onRemoveSize={removeSize}
          onUploadImage={uploadVariantImage}
          onRemoveImage={removeVariantImage}
          categoryOptions={CATEGORY_OPTIONS}
        />
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Total Products" value={products.length} />
            <StatCard label="Active" value={activeCount} />
            <StatCard label="Hidden" value={inactiveCount} />
          </div>

          <section className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-100 p-5 lg:p-6">
              <div className="flex flex-col gap-3 lg:flex-row">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by product, brand or subcategory..."
                  className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                />

                <select
                  value={sectionFilter}
                  onChange={(event) => setSectionFilter(event.target.value)}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-red-500"
                >
                  <option value="all">All Sections</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="accessories">Accessories</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-red-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Hidden</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-200 border-t-red-600" />
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                    Loading products
                  </p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-2xl text-zinc-400">
                  ◈
                </div>
                <h3 className="mt-5 font-['Outfit'] text-2xl font-bold text-zinc-950">
                  No products found
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  {products.length === 0
                    ? "Add your first footwear product to start building the store inventory."
                    : "Try changing your search or filters."}
                </p>
                {products.length === 0 && (
                  <button
                    type="button"
                    onClick={openCreate}
                    className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white"
                  >
                    Add Product
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {filteredProducts.map((product) => (
                  <ProductRow
                    key={product._id}
                    product={product}
                    onEdit={() => openEdit(product)}
                    onToggle={() => toggleProduct(product)}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function ProductEditor({
  form,
  setForm,
  editingId,
  saving,
  uploadingKey,
  onCancel,
  onSave,
  onFieldChange,
  onUpdateVariant,
  onAddVariant,
  onRemoveVariant,
  onUpdateSize,
  onAddSize,
  onRemoveSize,
  onUploadImage,
  onRemoveImage,
  categoryOptions,
}) {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-zinc-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">
            Product Editor
          </p>
          <h2 className="mt-1 font-['Outfit'] text-2xl font-extrabold text-zinc-950">
            {editingId ? "Edit Product" : "Add Product"}
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Create a complete product with variants, images, prices and stock.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-fit rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={onSave} className="p-6 lg:p-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <Field label="Product Name">
            <input
              name="name"
              value={form.name}
              onChange={onFieldChange}
              placeholder="Example: PBD Urban Runner"
              className={inputClass}
            />
          </Field>

          <Field label="Brand">
            <input
              name="brand"
              value={form.brand}
              onChange={onFieldChange}
              placeholder="Example: Popular"
              className={inputClass}
            />
          </Field>

          <Field label="Section">
            <select
              name="section"
              value={form.section}
              onChange={onFieldChange}
              className={inputClass}
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="accessories">Accessories</option>
            </select>
          </Field>

          <Field label="Category">
            <input
              name="category"
              value={form.category}
              readOnly
              className={`${inputClass} bg-zinc-50 text-zinc-500`}
            />
          </Field>

          <Field label="Subcategory">
            <select
              name="subcategory"
              value={form.subcategory}
              onChange={onFieldChange}
              className={inputClass}
            >
              {categoryOptions[form.section]?.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {formatLabel(subcategory)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Return Policy">
            <select
              name="returnPolicy"
              value={form.returnPolicy}
              onChange={onFieldChange}
              className={inputClass}
            >
              <option value="returnable">Returnable</option>
              <option value="exchange_only">Exchange Only</option>
              <option value="non_returnable">Non Returnable</option>
            </select>
          </Field>
        </div>

        <Field label="Description" className="mt-5">
          <textarea
            name="description"
            value={form.description}
            onChange={onFieldChange}
            rows={5}
            placeholder="Describe the product, comfort, materials and intended use..."
            className={`${inputClass} resize-none`}
          />
        </Field>

        <Field label="Return Note" className="mt-5">
          <input
            name="returnNote"
            value={form.returnNote}
            onChange={onFieldChange}
            placeholder="Optional customer-facing return information"
            className={inputClass}
          />
        </Field>

        <div className="mt-8 border-t border-zinc-100 pt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                Product Variants
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Each color can have its own images, sizes, stock and pricing.
              </p>
            </div>

            <button
              type="button"
              onClick={onAddVariant}
              className="w-fit rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
            >
              + Add Color Variant
            </button>
          </div>

          <div className="mt-5 space-y-5">
            {form.variants.map((variant, variantIndex) => (
              <VariantEditor
                key={variant._localId}
                variant={variant}
                index={variantIndex}
                uploading={uploadingKey === variant._localId}
                onUpdate={onUpdateVariant}
                onRemove={() => onRemoveVariant(variantIndex)}
                onUpdateSize={onUpdateSize}
                onAddSize={onAddSize}
                onRemoveSize={onRemoveSize}
                onUploadImage={onUploadImage}
                onRemoveImage={onRemoveImage}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-100 pt-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
            Storefront Flags
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Toggle
              label="Active"
              checked={form.isActive}
              onChange={() =>
                setForm((previous) => ({
                  ...previous,
                  isActive: !previous.isActive,
                }))
              }
            />
            <Toggle
              label="Featured"
              checked={form.isFeatured}
              onChange={() =>
                setForm((previous) => ({
                  ...previous,
                  isFeatured: !previous.isFeatured,
                }))
              }
            />
            <Toggle
              label="Popular"
              checked={form.isPopular}
              onChange={() =>
                setForm((previous) => ({
                  ...previous,
                  isPopular: !previous.isPopular,
                }))
              }
            />
            <Toggle
              label="Best Seller"
              checked={form.isBestSeller}
              onChange={() =>
                setForm((previous) => ({
                  ...previous,
                  isBestSeller: !previous.isBestSeller,
                }))
              }
            />
            <Toggle
              label="New Arrival"
              checked={form.isNewArrival}
              onChange={() =>
                setForm((previous) => ({
                  ...previous,
                  isNewArrival: !previous.isNewArrival,
                }))
              }
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-600 transition hover:bg-zinc-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-red-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving Product..."
              : editingId
              ? "Save Product"
              : "Create Product"}
          </button>
        </div>
      </form>
    </section>
  );
}

function VariantEditor({
  variant,
  index,
  uploading,
  onUpdate,
  onRemove,
  onUpdateSize,
  onAddSize,
  onRemoveSize,
  onUploadImage,
  onRemoveImage,
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-600">
            Variant {index + 1}
          </p>
          <p className="mt-1 text-sm font-bold text-zinc-900">
            Color, images, sizes and pricing
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50"
        >
          Remove
        </button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-4">
        <Field label="Color">
          <input
            value={variant.color}
            onChange={(event) =>
              onUpdate(index, "color", event.target.value)
            }
            placeholder="Black"
            className={inputClass}
          />
        </Field>

        <Field label="MRP">
          <input
            type="number"
            min="0"
            value={variant.mrp}
            onChange={(event) =>
              onUpdate(index, "mrp", event.target.value)
            }
            placeholder="2499"
            className={inputClass}
          />
        </Field>

        <Field label="Selling Price">
          <input
            type="number"
            min="0"
            value={variant.sellingPrice}
            onChange={(event) =>
              onUpdate(index, "sellingPrice", event.target.value)
            }
            placeholder="1999"
            className={inputClass}
          />
        </Field>

        <Field label="Discount %">
          <input
            type="number"
            min="0"
            max="100"
            value={variant.discount}
            onChange={(event) =>
              onUpdate(index, "discount", event.target.value)
            }
            placeholder="20"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
          Images
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          {variant.images.map((image, imageIndex) => (
            <div
              key={`${image.publicId}-${imageIndex}`}
              className="group relative h-24 w-24 overflow-hidden rounded-xl border border-zinc-200 bg-white"
            >
              <img
                src={image.url}
                alt={`${variant.color} ${imageIndex + 1}`}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />

              <button
                type="button"
                onClick={() => onRemoveImage(index, imageIndex)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950/80 text-xs font-bold text-white"
              >
                ×
              </button>
            </div>
          ))}

          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white text-center transition hover:border-red-400 hover:bg-red-50">
            <span className="text-xl text-red-600">+</span>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-wide text-zinc-500">
              {uploading ? "Uploading" : "Add Image"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              className="hidden"
              onChange={(event) => onUploadImage(event, index)}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
              Sizes & Stock
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Use values such as 6, 7, 8, 9, 10 or Free Size.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAddSize(index)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-700 hover:border-red-300 hover:text-red-600"
          >
            + Add Size
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {variant.sizes.map((size, sizeIndex) => (
            <div
              key={size._localId}
              className="grid grid-cols-[1fr_1fr_auto] gap-2"
            >
              <input
                value={size.size}
                onChange={(event) =>
                  onUpdateSize(index, sizeIndex, "size", event.target.value)
                }
                placeholder="Size"
                className={inputClass}
              />

              <input
                type="number"
                min="0"
                value={size.stock}
                onChange={(event) =>
                  onUpdateSize(index, sizeIndex, "stock", event.target.value)
                }
                placeholder="Stock"
                className={inputClass}
              />

              <button
                type="button"
                onClick={() => onRemoveSize(index, sizeIndex)}
                className="rounded-xl border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-400 hover:border-red-200 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductRow({ product, onEdit, onToggle }) {
  const image = product.variants?.[0]?.images?.[0]?.url || "";
  const variantCount = product.variants?.length || 0;
  const stock = product.variants?.reduce(
    (total, variant) =>
      total +
      (variant.sizes || []).reduce(
        (sizeTotal, size) => sizeTotal + Number(size.stock || 0),
        0
      ),
    0
  );

  const price = product.variants?.[0]?.sellingPrice;

  return (
    <article className="flex flex-col gap-4 p-5 transition hover:bg-zinc-50 sm:flex-row sm:items-center lg:p-6">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-zinc-100">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] font-bold text-zinc-400">
            NO IMAGE
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-['Outfit'] text-lg font-extrabold text-zinc-950">
            {product.name}
          </h3>

          <span
            className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${
              product.isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {product.isActive ? "Active" : "Hidden"}
          </span>
        </div>

        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          {product.brand} · {formatLabel(product.section)} ·{" "}
          {formatLabel(product.subcategory)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-zinc-500">
          <span className="rounded-lg bg-zinc-100 px-3 py-1.5">
            {variantCount} variant{variantCount === 1 ? "" : "s"}
          </span>
          <span className="rounded-lg bg-zinc-100 px-3 py-1.5">
            {stock} total stock
          </span>
          <span className="rounded-lg bg-zinc-100 px-3 py-1.5">
            ₹{Number(price || 0).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 gap-2 sm:flex-col lg:flex-row">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-xl bg-zinc-950 px-5 py-3 text-xs font-bold text-white transition hover:bg-red-600"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50"
        >
          {product.isActive ? "Hide" : "Show"}
        </button>
      </div>
    </article>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
        {label}
      </p>
      <p className="mt-2 font-['Outfit'] text-3xl font-extrabold text-zinc-950">
        {value}
      </p>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-xs font-bold transition ${
        checked
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 bg-zinc-50 text-zinc-500"
      }`}
    >
      <span>{label}</span>
      <span
        className={`h-5 w-9 rounded-full p-1 ${
          checked ? "bg-emerald-500" : "bg-zinc-300"
        }`}
      >
        <span
          className={`block h-3 w-3 rounded-full bg-white transition ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </span>
    </button>
  );
}

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10";

function formatLabel(value = "") {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default AdminProducts;
