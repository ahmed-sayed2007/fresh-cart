"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { IoIosCart } from "react-icons/io";
import { HiChevronDown } from "react-icons/hi";
import { getAllCategory } from "@/Survices/GetAllCategory.Services";
import { HiMenu, HiX } from "react-icons/hi";
import WishlistNavIcon from "../WishlistNavIcon/WishlistNavIcon";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/BrandsPage", label: "Brands" },
  { href: "/Category", label: "Category" },
  { href: "/cart", label: "cart" },
];

const authLinks = [
  { href: "/Profile", label: "Profile" },
  { href: "/allorders", label: "My Orders" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpenPath, setMobileOpenPath] = useState<string | null>(null);
  const mobileOpen = mobileOpenPath === pathname;
  const [scrolled, setScrolled] = useState(false);

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => {
    getAllCategory()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function logout() {
    signOut({ callbackUrl: "/Login" });
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#0B192C]/95 backdrop-blur-md shadow-md border-b border-[#C5A059]/30"
          : "bg-[#0B192C] border-b border-[#C5A059]/20"
      }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="FreshCart home">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#C5A059] text-[#0B192C] shadow-sm">
              <IoIosCart className="text-xl" />
            </span>
            <span className="font-heading text-xl font-bold tracking-tight text-[#FAF9F6]">
              Fresh<span className="text-[#C5A059]">Cart</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="hidden md:flex md:flex-1 md:justify-center">
            <ul className="flex items-center gap-1">
              {navLinks.map(({ href, label }) =>
                label === "Category" ? (
                  <li
                    key={href}
                    className="relative"
                    onMouseEnter={() => setCatOpen(true)}
                    onMouseLeave={() => setCatOpen(false)}>
                    <button
                      type="button"
                      onClick={() => setCatOpen((o) => !o)}
                      aria-haspopup="menu"
                      aria-expanded={catOpen}
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                        catOpen ? "text-[#C5A059]" : "text-[#FAF9F6]/80 hover:text-[#C5A059]"
                      }`}>
                      {label}
                      <HiChevronDown className={`text-base transition-transform ${catOpen ? "rotate-180" : ""}`} />
                    </button>
                    {catOpen && (
                      <div className="absolute left-0 top-full z-50 pt-2">
                        <ul
                          role="menu"
                          className="max-h-80 w-56 overflow-y-auto rounded-lg border border-[#C5A059]/40 bg-[#0B192C] py-2 shadow-lg shadow-[#0B192C]/20">
                          <li role="none">
                            <Link
                              role="menuitem"
                              href="/"
                              onClick={() => setCatOpen(false)}
                              className="block px-4 py-2 text-sm font-medium text-[#FAF9F6] transition-colors hover:bg-[#C5A059]/15 hover:text-[#C5A059]">
                              All Categories
                            </Link>
                          </li>
                          {categories.map((cat) => (
                            <li key={cat._id} role="none">
                              <Link
                                role="menuitem"
                                href={`/?category=${cat._id}`}
                                onClick={() => setCatOpen(false)}
                                className="block px-4 py-2 text-sm text-[#FAF9F6]/85 transition-colors hover:bg-[#C5A059]/15 hover:text-[#C5A059]">
                                {cat.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                        isActive(href) ? "text-[#C5A059]" : "text-[#FAF9F6]/80 hover:text-[#C5A059]"
                      }`}>
                      {label}
                      {isActive(href) && (
                        <span className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#C5A059]" />
                      )}
                    </Link>
                  </li>
                ),
              )}
              {session &&
                authLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                        isActive(href) ? "text-[#C5A059]" : "text-[#FAF9F6]/80 hover:text-[#C5A059]"
                      }`}>
                      {label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Wishlist icon */}
            <WishlistNavIcon />

            {/* Auth */}
            {session ? (
              <button
                onClick={logout}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#C5A059] bg-transparent px-4 py-2 text-sm font-semibold text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-[#0B192C]">
                Logout
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/Login"
                  className="rounded-md border border-[#C5A059] px-4 py-2 text-sm font-semibold text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-[#0B192C]">
                  Login
                </Link>
                <Link
                  href="/Register"
                  className="rounded-md bg-[#C5A059] px-4 py-2 text-sm font-semibold text-[#0B192C] shadow-sm transition-colors hover:bg-[#FAF9F6]">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpenPath((path) => (path === pathname ? null : pathname))}
              className="flex h-9 w-9 items-center justify-center rounded-md text-[#FAF9F6] transition hover:bg-[#C5A059]/15 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}>
              {mobileOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          mobileOpen ? "max-h-screen overflow-y-auto border-t border-[#C5A059]/30 bg-[#0B192C]" : "max-h-0"
        }`}>
        <nav className="px-4 pb-5 pt-3" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {navLinks.map(({ href, label }) =>
              label === "Category" ? (
                <li key={href}>
                  <button
                    type="button"
                    onClick={() => setCatOpen((o) => !o)}
                    aria-expanded={catOpen}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-[#FAF9F6]/85 hover:bg-[#C5A059]/15">
                    {label}
                    <HiChevronDown className={`text-base transition-transform ${catOpen ? "rotate-180" : ""}`} />
                  </button>
                  {catOpen && (
                    <ul className="ml-3 mt-1 space-y-0.5 border-l border-[#C5A059]/40 pl-2">
                      <li>
                        <Link
                          href="/"
                          className="block rounded-md px-3 py-2 text-sm text-[#FAF9F6]/85 hover:text-[#C5A059]">
                          All Categories
                        </Link>
                      </li>
                      {categories.map((cat) => (
                        <li key={cat._id}>
                          <Link
                            href={`/?category=${cat._id}`}
                            className="block rounded-md px-3 py-2 text-sm text-[#FAF9F6]/85 hover:text-[#C5A059]">
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(href) ? "text-[#C5A059]" : "text-[#FAF9F6]/85 hover:bg-[#C5A059]/15"
                    }`}>
                    {label}
                  </Link>
                </li>
              ),
            )}
            {session &&
              authLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(href) ? "text-[#C5A059]" : "text-[#FAF9F6]/85 hover:bg-[#C5A059]/15"
                    }`}>
                    {label}
                  </Link>
                </li>
              ))}
          </ul>

          <div className="mt-4 flex flex-col gap-2 border-t border-[#C5A059]/30 pt-4">
            {session ? (
              <button
                onClick={logout}
                className="w-full rounded-md border border-[#C5A059] py-2.5 text-sm font-semibold text-[#C5A059] transition hover:bg-[#C5A059] hover:text-[#0B192C]">
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/Login"
                  className="w-full rounded-md border border-[#C5A059] py-2.5 text-center text-sm font-semibold text-[#C5A059] transition hover:bg-[#C5A059] hover:text-[#0B192C]">
                  Login
                </Link>
                <Link
                  href="/Register"
                  className="w-full rounded-md bg-[#C5A059] py-2.5 text-center text-sm font-semibold text-[#0B192C]">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
