import { Link } from "react-router";

const ProductCard = ({ product }) => {
  const { _id, title, description, images = [], price, sizes = [] } = product;

  // Support images returned as strings or objects
  const image =
    typeof images[0] === "string"
      ? images[0]
      : images[0]?.url ||
        images[0]?.secure_url ||
        images[0]?.path ||
        "/placeholder-product.png";

  const totalStock = sizes.reduce(
    (total, item) => total + Number(item.stock || 0),
    0,
  );

  const isOutOfStock = totalStock === 0;

  const priceAmount = Number(price?.amount || 0);
  const currency = price?.currency || "INR";

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(priceAmount);

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/products/${_id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />

          {isOutOfStock && (
            <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white">
              Out of stock
            </span>
          )}

          {images.length > 1 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
              {images.length} photos
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${_id}`}>
          <h3 className="truncate font-semibold text-gray-900 transition hover:text-indigo-600">
            {title}
          </h3>
        </Link>

        {description && (
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500">
            {description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-gray-900">
            {formattedPrice}
          </span>

          <Link
            to={`/products/${_id}`}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
          >
            View
          </Link>
        </div>

        <div className="mt-3">
          {isOutOfStock ? (
            <span className="text-xs font-medium text-red-500">
              Currently unavailable
            </span>
          ) : (
            <span className="text-xs font-medium text-green-600">
              {totalStock} items available
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
