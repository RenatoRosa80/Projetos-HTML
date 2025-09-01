"use client";

type Category = {
  id: string;
  name: string;
};

export default function CategorySelector({
  categories,
  onChange,
}: {
  categories: Category[];
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition whitespace-nowrap"
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
