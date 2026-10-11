import { getUserOrders } from "@/Survices/Orders/getUserOrders.action";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "My Orders",
  description: "View all your FreshCart orders and track their status.",
};

export default async function AllOrders() {
  let orders: Awaited<ReturnType<typeof getUserOrders>> = [];
  let errorMessage: string | null = null;

  try {
    orders = await getUserOrders();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Failed to load orders.";
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
          <p className="mt-1 text-sm text-gray-500">Track and manage all your recent orders</p>
        </div>

        {errorMessage ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50 py-16 text-center">
            <span className="text-4xl">⚠️</span>
            <p className="font-semibold text-red-600">{errorMessage}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <span className="text-5xl">📦</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">No orders yet</h2>
              <p className="mt-1 text-sm text-gray-500">When you place an order, it will appear here.</p>
            </div>
            <Link
              href="/"
              className="rounded-xl brand-gradient px-8 py-3 font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white card-shadow"
              >
                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Order ID
                    </span>
                    <span className="font-mono text-sm font-bold text-gray-800">
                      #{order._id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold capitalize text-gray-600">
                      {order.paymentMethodType}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
                        order.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.isPaid ? "✓ Paid" : "⏳ Pending"}
                    </span>
                  </div>
                </div>

                {/* Order items */}
                <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {order.cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col gap-2 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-2"
                    >
                      <div className="relative h-20 w-full overflow-hidden rounded-lg bg-white">
                        <Image
                          src={item.product.imageCover}
                          alt={item.product.title}
                          fill
                          sizes="120px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <p className="line-clamp-2 text-xs font-semibold text-gray-800">
                          {item.product.title}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          Qty: {item.count} · {item.price} EGP
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order footer */}
                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {order.cartItems.length} item{order.cartItems.length !== 1 ? "s" : ""}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-500">Total:</span>
                    <span className="text-xl font-extrabold text-green-700">
                      {order.totalOrderPrice} EGP
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
