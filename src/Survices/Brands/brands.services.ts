import type { IBrandsResponse } from "../../Interface/brands.interface";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

export async function getAllBrands(): Promise<IBrandsResponse> {
  const response = await fetch(`${BASE_URL}/brands`);

  if (!response.ok) {
    throw new Error("Failed to fetch brands");
  }

  return response.json();
}

export async function getProductsByBrand(brandId: string) {
  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products?brand=${brandId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch brand products");
  }

  const result = await response.json();

  return Array.isArray(result.data) ? result.data : [];
}
