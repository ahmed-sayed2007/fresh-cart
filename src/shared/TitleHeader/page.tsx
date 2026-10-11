export default function TitleHeader({ title, side }: { title: string; side: string }) {
  return (
    <div className="mb-2">
      <h2 className="relative inline-flex items-center gap-2 ps-4 text-2xl font-extrabold tracking-tight text-gray-900 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full before:bg-green-600">
        {title}
        <span className="text-green-600">{side}</span>
      </h2>
      <p className="mt-1 ps-4 text-sm text-gray-500">
        Browse our curated selection just for you
      </p>
    </div>
  );
}
