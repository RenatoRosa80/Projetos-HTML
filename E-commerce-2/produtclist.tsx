"use client";

import { useEffect, useRef, useState } from "react";

type Product = {
  id: string;
  name: string;
  variants: any[];
};

export default function ProductList({
  products: initialProducts,
  title,
  categoryId,
}: {
  products: Product[];
  title: string;
  categoryId?: string;
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  async function loadMore(reset = false) {
    if (loading) return;
    setLoading(true);

    const res = await fetch(
      `/api/products?page=${reset ? 1 : page + 1}${
        categoryId ? `&categoryId=${categoryId}` : ""
      }`
    );

    const newProducts: Product[] = await res.json();

    if (reset) {
      setProducts(newProducts);
      setPage(1);
    } else if (newProducts.length > 0) {
      setProducts((prev) => [...prev, ...newProducts]);
      setPage((prev) => prev + 1);
    }

    setLoading(false);
  }

  // Reinicia quando trocar de categoria
  useEffect(() => {
    if (categoryId) {
      loadMore(true);
    }
  }, [categoryId]);

  // IntersectionObserver para infinite scroll
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loading, categoryId]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border p-4 shadow-sm hover:shadow-md transition"
          >
            <h3 className="font-medium">{p.name}</h3>
          </div>
        ))}
      </div>

      <div ref={observerRef} className="h-10 w-full" />
      {loading && <p className="text-center text-gray-500">Carregando...</p>}
    </div>
  );
}
