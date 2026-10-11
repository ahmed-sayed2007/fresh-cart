import type { Iproduct } from "@/Interface/product.interface";
import AddBtn from "@/shared/AddBtn/AddBtn";
import AddToWishlist from "@/shared/Wishlist/AddToWishlist";
import DetailsSwiper from "@/shared/DetailsSwiper/page";
import { getProductDetails } from "@/Survices/GetProductDetails.services";
import Link from "next/link";
import { GrPrevious } from "react-icons/gr";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data: Iproduct = await getProductDetails(id);

  const stars = Math.round(data?.ratingsAverage ?? 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-700"
        >
          <GrPrevious className="text-xs" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Images */}
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 card-shadow">
            <DetailsSwiper images={data?.images ?? []} />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">
            {/* Brand & Category */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-600">
                {data?.brand?.name}
              </p>
              <h1 className="mt-1 text-2xl font-extrabold leading-snug text-gray-900 sm:text-3xl">
                {data?.title}
              </h1>
              <p className="mt-1 text-sm text-gray-500">{data?.category?.name}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`h-5 w-5 ${star <= stars ? "text-amber-400" : "text-gray-200"}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {data?.ratingsAverage} ({data?.ratingsQuantity ?? 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-green-700">
                {data?.price} EGP
              </span>
              <span className="text-base text-gray-400 line-through">
                {(data?.price ?? 0) + 400} EGP
              </span>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                Save 400 EGP
              </span>
            </div>

            {/* Description */}
            <p className="leading-relaxed text-gray-600">{data?.description}</p>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-200" />

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="quantity"
                className="text-sm font-semibold text-gray-700"
              >
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min={1}
                defaultValue={1}
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-semibold shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[180px]">
                <AddBtn productId={data._id} />
              </div>
              <AddToWishlist productId={data._id} />
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-green-700">In Stock</span>
              <span className="ml-auto text-xs text-green-600">
                {data?.quantity} units available
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
