import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useApi from "../api/api";
import { createProduct, getProduct, updateProduct } from "../api/productApi";
import useAuthContext from "../context/useAuthContext";

const AddProduct = () => {
  const api = useApi();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { user, isUserLoading } = useAuthContext();
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    currency: "INR",
    sizes: [{ size: "M", stock: 50 }],
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEditing);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return undefined;

    let isCurrentRequest = true;

    const loadProduct = async () => {
      setLoadingProduct(true);

      try {
        const response = await getProduct(api, id);
        const product = response.data?.data?.product;

        if (!product) {
          throw new Error("Product not found.");
        }

        if (isCurrentRequest) {
          setForm({
            title: product.title || "",
            description: product.description || "",
            amount: String(product.price?.amount ?? ""),
            currency: product.price?.currency || "INR",
            sizes: product.sizes?.length
              ? product.sizes.map(({ size, stock }) => ({ size, stock }))
              : [{ size: "M", stock: 0 }],
          });
          setExistingImages(product.images || []);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setMessage(error.response?.data?.message || error.message);
        }
      } finally {
        if (isCurrentRequest) {
          setLoadingProduct(false);
        }
      }
    };

    loadProduct();
    return () => {
      isCurrentRequest = false;
    };
  }, [api, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizeChange = (index, field, value) => {
    setForm((prev) => {
      const sizes = [...prev.sizes];
      sizes[index] = {
        ...sizes[index],
        [field]: field === "stock" ? Number(value) : value,
      };

      return { ...prev, sizes };
    });
  };

  const addSize = () => {
    setForm((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", stock: 0 }],
    }));
  };

  const removeSize = (index) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files || []);

    if (selectedImages.length > 5) {
      setMessage("Choose no more than 5 images.");
      e.target.value = "";
      return;
    }

    if (selectedImages.some((image) => image.size > 1024 * 1024)) {
      setMessage("Each image must be 1 MB or smaller.");
      e.target.value = "";
      return;
    }

    setMessage("");
    setImages(selectedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      images.forEach((image) => {
        formData.append("images", image);
      });

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append(
        "price",
        JSON.stringify({
          amount: Number(form.amount),
          currency: form.currency,
        }),
      );
      formData.append("sizes", JSON.stringify(form.sizes));

      if (isEditing) {
        await updateProduct(api, id, formData);
      } else {
        await createProduct(api, formData);
      }

      navigate("/dashboard");
    } catch (error) {
      const validationError = error.response?.data?.error;
      setMessage(
        (Array.isArray(validationError) && validationError[0]?.msg) ||
          error.response?.data?.message ||
          `Unable to ${isEditing ? "update" : "add"} product.`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading || loadingProduct) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading product...</p>
      </main>
    );
  }

  if (user?.role !== "seller") {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-5 text-center">
        <p className="text-sm font-medium text-slate-600">
          Seller access is required to manage products.
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {isEditing ? "Edit Product" : "Add Product"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Add product information, pricing, sizes and images.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {/* Images */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Product Images
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-10 transition hover:border-indigo-500 hover:bg-indigo-50">
              <svg
                className="mb-3 h-10 w-10 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>

              <span className="text-sm font-medium text-slate-700">
                Click to upload images
              </span>

              <span className="mt-1 text-xs text-slate-400">
                Up to 5 images, 1 MB each. Selecting images replaces current images.
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600"
                  >
                    {image.name}
                  </div>
                ))}
              </div>
            )}

            {isEditing && images.length === 0 && existingImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {existingImages.map((image) => (
                  <img
                    key={image.fileId || image.url}
                    src={image.url}
                    alt="Current product"
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter product title"
              minLength={3}
              maxLength={50}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={5}
              minLength={50}
              maxLength={150}
              required
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Price
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="500"
                min="0"
                step="0.01"
                required
                className="rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                Sizes
              </label>

              <button
                type="button"
                onClick={addSize}
                className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
              >
                + Add Size
              </button>
            </div>

            <div className="space-y-3">
              {form.sizes.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_auto] gap-3"
                >
                  <select
                    value={item.size}
                    onChange={(e) =>
                      handleSizeChange(index, "size", e.target.value)
                    }
                    required
                    className="rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="" disabled>
                      Select size
                    </option>
                    { ["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={item.stock}
                    onChange={(e) =>
                      handleSizeChange(index, "stock", e.target.value)
                    }
                    placeholder="Stock"
                    className="rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  {form.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="rounded-lg px-3 text-red-500 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
              {loading
                ? isEditing
                  ? "Saving Changes..."
                  : "Adding Product..."
                : isEditing
                  ? "Save Changes"
                  : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
