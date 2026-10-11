import { GridLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4">
      <GridLoader color="#16a34a" size={14} />
      <p className="animate-pulse text-sm font-medium text-gray-400">Loading…</p>
    </div>
  );
}
