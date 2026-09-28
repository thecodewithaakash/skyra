import { Link } from "react-router";
import useAuthContext from "../context/useAuthContext";

const Navbar = () => {
  const { user, isUserLoading } = useAuthContext();

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-gray-900">
          Skyra
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm text-gray-600 transition hover:text-black"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-sm text-gray-600 transition hover:text-black"
          >
            Products
          </Link>

          <Link
            to="/about"
            className="text-sm text-gray-600 transition hover:text-black"
          >
            About
          </Link>

          <Link
            to="/profile"
            className="text-sm text-gray-600 transition hover:text-black"
          >
            Profile
          </Link>

          {user?.role === "seller" && (
            <Link
              to="/dashboard"
              className="text-sm text-gray-600 transition hover:text-black"
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>

                <span className="hidden text-sm font-medium text-gray-700 sm:block">
                  {user.name}
                </span>
              </Link>
            </>
          ) : isUserLoading ? (
            <span className="text-sm text-gray-500">Loading account...</span>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-black"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
