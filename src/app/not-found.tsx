import Image from "next/image";
import Link from "next/link";
import { GrPrevious } from "react-icons/gr";
import errorImg from "../assets/404-page-n3.png";

export const metadata = {
  title: "404 — Page Not Found",
  description: "The page you were looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="relative h-screen w-full">
      <Image
        src={errorImg}
        alt="Page not found"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <Link
          href="/"
          className="group flex items-center justify-center gap-3 rounded-2xl brand-gradient px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-95"
        >
          <GrPrevious className="transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
