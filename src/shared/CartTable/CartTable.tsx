"use client";

import { toast } from "@/components/ui/toast";
import type { CartInterface } from "@/Interface/Cart.interface";
import { clearAllProducts } from "@/Survices/CartAction/clearAllCart.action";
import { deleteProductCart } from "@/Survices/CartAction/deleteProduct.action";
import { getProductLog } from "@/Survices/CartAction/getLogedUser.action";
import { updateCartProductQuantity } from "@/Survices/CartAction/updateCartProductQuantity.action";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTrash, FaShoppingCart } from "react-icons/fa";

export default function CartTable() {
  const [cartList, setCartList] = useState<CartInterface["data"]["products"]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [cartId, setCartId] = useState<number>(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function getAllProductsCart() {
    try {
      const res = await getProductLog();
      if (res.status === "success") {
        setCartList(res.data.products);
        setTotalPrice(res.data.totalCartPrice);
        setCartId(res.cartId);
      }
    } catch (error) {
      console.error("Get cart error:", error);
      toast.add({ title: "Error", description: "Failed to load your cart", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = window.setTimeout(getAllProductsCart, 0);
    return () => window.clearTimeout(id);
  }, []);

  async function removeItem(productId: string) {
    setDeletingId(productId);
    try {
      const res = await deleteProductCart(productId);
      if (res.status === "success") {
        setCartList(res.data.products);
        setTotalPrice(res.data.totalCartPrice);
        setCartId(res.cartId);
        toast.add({ title: "Removed", description: "Item removed from cart", type: "default" });
      }
    } catch {
      toast.add({ title: "Error", description: "Failed to remove item", type: "error" });
    } finally {
      setDeletingId(null);
    }
  }

  async function clearAllCart() {
    try {
      const res = await clearAllProducts();
      if (res.message === "success") {
        setCartList([]);
        setTotalPrice(0);
        setCartId(res.cartId);
        toast.add({ title: "Cart cleared", description: "All items removed", type: "default" });
      }
    } catch {
      toast.add({ title: "Error", description: "Failed to clear cart", type: "error" });
    }
  }

  async function updateProduct(count: number, productId: string) {
    if (count < 1) return;
    try {
      const res = await updateCartProductQuantity(count, productId);
      if (res.status === "success") {
        setCartList(res.data.products);
        setTotalPrice(res.data.totalCartPrice);
        setCartId(res.cartId);
      }
    } catch {
      toast.add({ title: "Error", description: "Failed to update quantity", type: "error" });
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="h-8 w-48 skeleton rounded-lg mb-8" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-4 flex gap-4 rounded-2xl border border-gray-100 bg-white p-4">
            <div className="h-20 w-20 skeleton rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 skeleton rounded" />
              <div className="h-3 w-1/3 skeleton rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cartList.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-gray-300">
          <FaShoppingCart className="text-4xl" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Add items to get started</p>
        </div>
        <Link
          href="/"
          className="rounded-xl brand-gradient px-8 py-3 font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
            <p className="mt-1 text-sm text-gray-500">
              {cartList.length} {cartList.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <button
            onClick={() => void clearAllCart()}
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
          >
            <FaTrash className="text-xs" />
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {cartList.map((product) => (
              <div
                key={product._id}
                className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 card-shadow transition-shadow hover:card-shadow-md"
              >
                {/* Image */}
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={product.product.imageCover}
                    alt={product.product.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                      {product.product.category.name}
                    </p>
                    <h3 className="line-clamp-1 font-semibold text-gray-900">
                      {product.product.title}
                    </h3>
                    <p className="mt-0.5 text-lg font-extrabold text-green-700">
                      {product.price} EGP
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity stepper */}
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1">
                      <button
                        type="button"
                        onClick={() => void updateProduct(product.count - 1, product.product._id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-600 transition hover:bg-white hover:shadow-sm disabled:opacity-40"
                        disabled={product.count <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-900">
                        {product.count}
                      </span>
                      <button
                        type="button"
                        onClick={() => void updateProduct(product.count + 1, product.product._id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-600 transition hover:bg-white hover:shadow-sm"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      disabled={deletingId === product._id}
                      onClick={() => void removeItem(product.product.id ?? product.product._id)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                      aria-label="Remove item"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 card-shadow">
              <h2 className="mb-4 text-lg font-extrabold text-gray-900">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartList.length} items)</span>
                  <span className="font-semibold text-gray-900">{totalPrice} EGP</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-extrabold text-green-700">{totalPrice} EGP</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link href={`/CashOnDelivery/${cartId}`} className="w-full">
                  <button
                    type="button"
                    className="w-full rounded-xl brand-gradient py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 active:scale-[.98]"
                  >
                    Cash on Delivery
                  </button>
                </Link>
                <Link href={`/CheckoutSession/${cartId}`} className="w-full">
                  <button
                    type="button"
                    className="w-full rounded-xl border border-green-600 py-3 text-sm font-bold text-green-700 transition hover:bg-green-50 active:scale-[.98]"
                  >
                    Pay with Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
