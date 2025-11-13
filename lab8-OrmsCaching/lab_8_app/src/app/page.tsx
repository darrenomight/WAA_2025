"use client";
import { useEffect, useState, useRef, useCallback } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const limit = 20;

  // Fetch products safely using refs
  const fetchProducts = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;

    try {
      const res = await fetch(
        `/api/products?page=${pageRef.current}&limit=${limit}`
      );
      const data: Product[] = await res.json();

      setProducts(prev => [...prev, ...data]);
      setHasMore(data.length === limit);

      // Increment page for next fetch
      pageRef.current += 1;
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      loadingRef.current = false;
    }
  }, [hasMore]);

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Intersection Observer for infinite scroll
  const lastProductRef = useCallback(
    (node: HTMLDivElement) => {
      if (loadingRef.current) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          fetchProducts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchProducts, hasMore]
  );

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Product Catalog</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p, idx) => {
          const isLast = idx === products.length - 1;
          return (
            <div
              ref={isLast ? lastProductRef : null}
              key={`${p.id}-${idx}`} // unique key
              className="border rounded-2xl shadow-sm overflow-hidden bg-white hover:shadow-md transition"
            >
              <img
                src={p.image}
                alt={p.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-lg">{p.name}</h2>
                <p className="text-gray-600 text-sm mt-1">{p.description}</p>
                <p className="text-green-600 font-bold mt-3">
                  €{p.price.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {loadingRef.current && (
        <p className="text-center mt-6 text-gray-500">
          Loading more products...
        </p>
      )}
      {!hasMore && !loadingRef.current && (
        <p className="text-center mt-6 text-gray-400">No more products!</p>
      )}
    </main>
  );
}