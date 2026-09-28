import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import useApi from "../api/api";
import { getProduct } from "../api/productApi";

const ProductView = () => {
  const { id } = useParams();
  const api = useApi();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);
        setSelectedImage(0);
        setSelectedSize(null);
        setQuantity(1);

        const response = await getProduct(api, id, {
          signal: controller.signal,
        });
        const payload = response.data;
        const productData =
          payload?.data?.product ??
          payload?.product ??
          payload?.data ??
          payload;

        if (!productData?._id) {
          setError("Product not found.");
          return;
        }

        setProduct(productData);

        // Select first available size by default
        if (Array.isArray(productData.sizes) && productData.sizes.length > 0) {
          const availableSize = productData.sizes.find(
            (item) => Number(item.stock) > 0,
          );

          setSelectedSize(availableSize || productData.sizes[0]);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(
            error.response?.data?.message ||
              error.message ||
              "Unable to load product.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();
    return () => controller.abort();
  }, [api, id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-5">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

            <p className="text-sm text-gray-500">Loading product...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
            📦
          </div>

          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error || "The product you're looking for doesn't exist."}
          </p>

          <Link
            to="/products"
            className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const images = (product.images || [])
    .map((image) => {
      if (typeof image === "string") return image;

      return (
        image?.url || image?.secure_url || image?.path || image?.location || ""
      );
    })
    .filter(Boolean);

  const currentImage = images[selectedImage] || "/placeholder-product.png";

  const priceAmount = Number(product.price?.amount || 0);

  const currency = product.price?.currency || "INR";

  const selectedStock = selectedSize?.stock || 0;

  const totalStock =
    product.sizes?.reduce(
      (total, item) => total + Number(item.stock || 0),
      0,
    ) || 0;

  const isInStock = totalStock > 0;

  const increaseQuantity = () => {
    if (quantity < selectedStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const formatPrice = (amount) => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${currency} ${amount}`;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          <span>←</span>
          Back to Products
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={currentImage}
                  alt={product.title}
                  className="h-full w-full object-cover transition duration-500"
                />

                {!isInStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-6">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition ${
                        selectedImage === index
                          ? "border-indigo-600"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              {product.category && (
                <span className="w-fit rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold capitalize text-indigo-700">
                  {product.category}
                </span>
              )}

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product.title}
              </h1>

              <div className="mt-4 flex items-center gap-2">
                {isInStock ? (
                  <>
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                    <span className="text-sm font-medium text-green-600">
                      In stock
                    </span>
                  </>
                ) : (
                  <>
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

                    <span className="text-sm font-medium text-red-500">
                      Out of stock
                    </span>
                  </>
                )}
              </div>

              <div className="mt-6">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(priceAmount)}
                </span>
              </div>

              <div className="mt-6">
                <h2 className="text-sm font-semibold text-gray-900">
                  Description
                </h2>

                <p className="mt-2 leading-7 text-gray-600">
                  {product.description}
                </p>
              </div>

              <div className="my-7 border-t border-gray-200" />

              {product.sizes?.length > 0 && (
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-900">
                      Select Size
                    </h2>

                    {selectedSize && (
                      <span className="text-xs text-gray-500">
                        {selectedStock} available
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {product.sizes.map((sizeItem) => {
                      const isSelected = selectedSize?.size === sizeItem.size;

                      const isDisabled = sizeItem.stock <= 0;

                      return (
                        <button
                          key={sizeItem.size}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => handleSizeChange(sizeItem)}
                          className={`relative min-w-16 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : isDisabled
                                ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300"
                                : "border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600"
                          }`}
                        >
                          {sizeItem.size}

                          {isDisabled && (
                            <span className="absolute inset-x-1/2 top-1/2 h-px w-10 -translate-x-1/2 rotate-45 bg-gray-300" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isInStock && selectedSize && selectedStock > 0 && (
                <div className="mt-8">
                  <h2 className="mb-3 text-sm font-semibold text-gray-900">
                    Quantity
                  </h2>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    {/* Quantity */}
                    <div className="flex h-12 w-fit items-center rounded-lg border border-gray-300">
                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="flex h-full w-12 items-center justify-center text-lg text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="flex w-12 items-center justify-center text-sm font-semibold text-gray-900">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={increaseQuantity}
                        disabled={quantity >= selectedStock}
                        className="flex h-full w-12 items-center justify-center text-lg text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="h-12 flex-1 rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-8">
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Currency</p>
                      <p className="mt-1 font-medium text-gray-900">
                        {currency}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Total Stock</p>
                      <p className="mt-1 font-medium text-gray-900">
                        {totalStock}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductView;
