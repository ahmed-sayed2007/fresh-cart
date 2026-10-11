"use client";

import { useState } from "react";
import Link from "next/link";

interface OrderData {
  response: Record<string, unknown>;
  shippingAddress: {
    city: string;
    phone: string;
    details: string;
    postalCode: string;
  };
}

function getOrderInfo(response: Record<string, unknown>) {
  const data =
    response.data && typeof response.data === "object" ? (response.data as Record<string, unknown>) : response;

  const order = data.order && typeof data.order === "object" ? (data.order as Record<string, unknown>) : data;

  return {
    id: order._id ?? order.id ?? order.orderId,
    status: order.status ?? response.status,
    total: order.totalOrderPrice ?? order.totalPrice ?? order.total,
  };
}

export default function OrderSuccess() {
  const [orderData] = useState<OrderData | null>(() => {
    try {
      const saved = sessionStorage.getItem("completedOrder");
      return saved ? (JSON.parse(saved) as OrderData) : null;
    } catch {
      return null;
    }
  });

  if (!orderData) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Order information unavailable</h1>
          <p className="mt-3 text-gray-600">Please return to checkout to place an order.</p>
          <Link href="/" className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const info = getOrderInfo(orderData.response);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-5">
      <section className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
            ✓
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-900">Order Confirmed!</h1>

          <p className="mt-3 text-gray-600">Thank you! Your order was submitted successfully.</p>
        </div>

        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-5">
          <p className="text-sm text-gray-600">Order Number</p>
          <p className="mt-1 break-all text-xl font-bold text-green-800">
            {info.id != null ? String(info.id) : "See API response"}
          </p>

          {info.status != null && (
            <p className="mt-3 text-sm text-gray-700">
              Status: <strong>{String(info.status)}</strong>
            </p>
          )}

          {info.total != null && (
            <p className="mt-2 text-sm text-gray-700">
              Total: <strong>{String(info.total)}</strong>
            </p>
          )}
        </div>

        <div className="mt-7">
          <h2 className="text-xl font-bold text-gray-900">Shipping Details</h2>

          <div className="mt-4 space-y-3 rounded-xl border p-5">
            <div>
              <p className="text-sm text-gray-500">City</p>
              <p className="font-medium text-gray-900">{orderData.shippingAddress.city}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{orderData.shippingAddress.phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium text-gray-900">{orderData.shippingAddress.details}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Postal Code</p>
              <p className="font-medium text-gray-900">{orderData.shippingAddress.postalCode}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex-1 rounded-lg bg-green-600 px-5 py-3 text-center font-bold text-white transition hover:bg-green-700">
            Continue Shopping
          </Link>

          <Link
            href="/cart"
            className="flex-1 rounded-lg border px-5 py-3 text-center font-bold text-gray-700 transition hover:bg-gray-50">
            Back to Cart
          </Link>
        </div>
      </section>
    </main>
  );
}
