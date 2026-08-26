function AdminOrders() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">
        Sales
      </p>

      <h2 className="mt-3 font-['Outfit'] text-4xl font-extrabold tracking-[-0.04em] text-zinc-950">
        Orders
      </h2>

      <p className="mt-3 text-sm text-zinc-500">
        View, track and manage customer orders.
      </p>

      <div className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-6 sm:p-8">
        <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-600">
            □
          </div>

          <h3 className="mt-5 font-['Outfit'] text-2xl font-bold text-zinc-950">
            Order Management
          </h3>

          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
            Customer orders will be connected to this dashboard next.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;