import { useEffect, useState } from "react";
import { Link } from "react-router";
import useApi from "../api/api";
import { deleteProduct, getSellerProducts } from "../api/productApi";
import useAuthContext from "../context/useAuthContext";

const SellerProducts = () => {
  const api = useApi();
  const { user, isUserLoading } = useAuthContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (user?.role !== "seller") {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getSellerProducts(api, {
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setProducts(response.data?.data?.products || []);
        }
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load your products.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProducts();
    return () => controller.abort();
  }, [api, reload, user?.role]);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(product._id);
    setError("");

    try {
      await deleteProduct(api, product._id);
      setProducts((currentProducts) =>
        currentProducts.filter((item) => item._id !== product._id),
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to delete product.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isUserLoading || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading your products...</p>
      </main>
    );
  }

  if (user?.role !== "seller") {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-5 text-center">
        <p className="text-sm font-medium text-gray-600">
          Seller access is required to manage products.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-indigo-600">Seller</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              Your products
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          </div>
          <Link
            to="/seller/products/new"
            className="rounded-lg bg-gray-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Add product
          </Link>
        </div>

        {error && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setReload((value) => value + 1)}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {products.length === 0 && !error ? (
          <div className="flex min-h-80 flex-col items-center justify-center text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No products yet
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Products you add will appear here.
            </p>
            <Link
              to="/seller/products/new"
              className="mt-5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
            >
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="mt-6 divide-y divide-gray-200">
            {products.map((product) => {
              const image = product.images?.[0]?.url;
              const totalStock = (product.sizes || []).reduce(
                (total, size) => total + Number(size.stock || 0),
                0,
              );

              return (
                <article
                  key={product._id}
                  className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
                >
                  <img
                    src={image || "/placeholder-product.png"}
                    alt={product.title}
                    className="h-20 w-20 rounded-lg bg-gray-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-semibold text-gray-900">
                      {product.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: product.price?.currency || "INR",
                      }).format(Number(product.price?.amount || 0))}
                      <span className="mx-2 text-gray-300">|</span>
                      {totalStock} in stock
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/seller/products/${product._id}/edit`}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      disabled={deletingId === product._id}
                      onClick={() => handleDelete(product)}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === product._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default SellerProducts;