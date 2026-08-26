function AdminProducts() {
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
            Manage all your footwear products and inventory.
          </p>
        </div>

        <button className="rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700">
          + Add Product
        </button>
      </div>

      <div className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-6 sm:p-8">
        <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-600">
            ◈
          </div>

          <h3 className="mt-5 font-['Outfit'] text-2xl font-bold text-zinc-950">
            Product Management
          </h3>

          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
            Your product management system will appear here. Next, we will
            connect this page with your existing product API.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;