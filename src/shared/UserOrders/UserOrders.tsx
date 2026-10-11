"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GridLoader } from "react-spinners";
import type { UserOrder } from "@/Interface/order.interface";
import { getUserOrders } from "@/Survices/User/user.services";
import { toast } from "@/components/ui/toast";

export default function UserOrders() {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (error) {
        toast.add({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load orders",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    void fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center py-20">
        <GridLoader color="#15803d" />
      </div>
    );
  }

  return (
    <div className="mx-auto my-10 max-w-6xl p-6">
      <h2 className="mb-8 text-3xl font-extrabold text-gray-800">My Orders</h2>

      {orders.length === 0 ? (
        <div className="rounded-lg bg-gray-50 py-12 text-center text-gray-500">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-xs font-semibold text-gray-400">Order ID</span>
                  <p className="font-mono text-sm text-gray-700">#{order._id}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    order.isPaid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                  {order.isPaid ? "Paid" : "Processing"}
                </span>
              </div>

              <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {order.cartItems?.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3 rounded-lg bg-gray-50 p-2">
                    <Image
                      src={item.product.imageCover}
                      alt={item.product.title}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-md object-cover"
                    />
                    <div className="min-w-0 overflow-hidden">
                      <p className="truncate text-xs font-bold text-gray-800">{item.product.title}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.count} | Price: {item.price} EGP
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm font-semibold">
                <span>
                  Payment Method: <strong className="uppercase">{order.paymentMethodType}</strong>
                </span>
                <span className="text-lg font-extrabold text-emerald-600">Total: {order.totalOrderPrice} EGP</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
