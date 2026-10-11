import CartTable from "@/shared/CartTable/CartTable";

export const metadata = {
  title: "Shopping Cart",
  description: "View and manage the items in your FreshCart shopping cart.",
};

export default function cart() {
  return <CartTable />;
}
