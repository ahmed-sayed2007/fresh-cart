import { getMyToken } from "@/Utillitez/getMyToken";
import type { IWishlistProduct } from "@/Interface/wishlist.interface";

const WISHLIST_URL = "https://ecommerce.routemisr.com/api/v1/wishlist";

async function getTokenValue(): Promise<string> {
  const tokenData = await getMyToken();
  const token = tokenData?.token;

  if (!token) {
    throw new Error("Please login to use your wishlist.");
  }

  return token;
}

async function parseResponse(response: Response) {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
}

type WishlistItem = IWishlistProduct | { product: IWishlistProduct };

function getWishlistProduct(item: WishlistItem): IWishlistProduct {
  return "product" in item ? item.product : item;
}

// Get wishlist products
export async function getWishlistProducts(): Promise<IWishlistProduct[]> {
  const token = await getTokenValue();

  const response = await fetch(WISHLIST_URL, {
    method: "GET",
    headers: {
      token,
    },
    cache: "no-store",
  });

  const result = await parseResponse(response);

  if (Array.isArray(result.data)) {
    return (result.data as WishlistItem[]).map(getWishlistProduct);
  }

  if (Array.isArray(result.data?.products)) {
    return (result.data.products as WishlistItem[]).map(getWishlistProduct);
  }

  return [];
}

// Add product to wishlist
export async function addToWishlist(productId: string) {
  const token = await getTokenValue();

  const response = await fetch(WISHLIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify({ productId }),
  });

  return parseResponse(response);
}

// Remove product from wishlist
export async function removeFromWishlist(productId: string) {
  const token = await getTokenValue();

  const response = await fetch(`${WISHLIST_URL}/${productId}`, {
    method: "DELETE",
    headers: {
      token,
    },
  });

  return parseResponse(response);
}
