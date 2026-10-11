export async function getSubCategories(catId: string) {
  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${catId}/subcategories`);

  if (!response.ok) {
    throw new Error("Failed to fetch subcategories");
  }

  return response.json();
}
