import { NavLink } from "react-router";

const Footer = () => {
  const navLinkClass = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive
        ? "text-gray-900 font-medium"
        : "text-gray-500 hover:text-gray-900"
    }`;

  return (
    <footer className="border-t border-gray-200 bg-white text-gray-600">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 py-8 sm:flex-row">
        <NavLink to="/" className="flex items-center text-gray-900">
          <span className="ml-3 text-xl font-semibold">Skyra</span>
        </NavLink>

        <p className="text-sm text-gray-500 sm:ml-4 sm:border-l sm:border-gray-200 sm:pl-4">
          © {new Date().getFullYear()} Skyra
        </p>

        <nav className="flex items-center gap-5 text-sm sm:ml-auto">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/profile" className={navLinkClass}>
            Profile
          </NavLink>
        </nav>

        <div className="flex items-center gap-4 sm:ml-4 sm:border-l sm:border-gray-200 sm:pl-4">
          <a
            href="#"
            aria-label="Facebook"
            className="text-gray-400 transition-colors hover:text-gray-900"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>

          <a
            href="#"
            aria-label="Twitter"
            className="text-gray-400 transition-colors hover:text-gray-900"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
            </svg>
          </a>

          <a
            href="#"
            aria-label="Instagram"
            className="text-gray-400 transition-colors hover:text-gray-900"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" />
              <path d="M16 11.37a4 4 0 1 1-7.94 1.18 4 4 0 0 1 7.94-1.18z" />
              <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
