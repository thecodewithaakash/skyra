import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import useApi from "../api/api";
import { getProducts } from "../api/productApi";

const Products = () => {
  const api = useApi();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts(api, { signal: controller.signal });

        if (!controller.signal.aborted) {
          setProducts(response.data?.data?.products || []);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error.response?.data?.message || "Unable to load products.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [api, retry]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <div className="animate-pulse">
            <div className="h-4 w-28 rounded bg-gray-200" />

            <div className="mt-3 h-9 w-40 rounded bg-gray-200" />

            <div className="mt-3 h-5 w-64 rounded bg-gray-200" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="aspect-square animate-pulse bg-gray-200" />

                <div className="space-y-3 p-4">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />

                  <div className="flex justify-between pt-2">
                    <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="h-9 w-16 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl">
            ⚠️
          </div>

          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Unable to load products
          </h1>

          <p className="mt-2 max-w-md text-sm text-gray-500">{error}</p>

          <button
            type="button"
            onClick={() => setRetry((value) => value + 1)}
            className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div>
          <p className="text-sm font-medium text-indigo-600">Our Collection</p>

          <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Products
              </h1>

              <p className="mt-2 text-gray-500">Explore our latest products.</p>
            </div>
          </div>

     
        </div>


        {products.length === 0 ? (
          <div className="flex min-h-96 flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
              📦
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No products found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              There are currently no products available.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;
