import { Link } from "react-router";

const About = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Intro */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center">
        <span className="text-sm font-medium text-indigo-600">
          About MiniShop
        </span>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          Simple shopping, made better.
        </h1>

        <p className="mt-5 text-lg leading-8 text-gray-600">
          MiniShop is a simple ecommerce platform built to make discovering
          and buying products easy, fast, and enjoyable.
        </p>
      </section>

      {/* Values */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-5xl gap-6 px-5 py-12 sm:grid-cols-3">

          <div className="rounded-xl bg-white p-6 text-center">
            <div className="text-2xl">🛍️</div>

            <h2 className="mt-4 font-semibold text-gray-900">
              Quality Products
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Find products that are worth adding to your collection.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center">
            <div className="text-2xl">🔒</div>

            <h2 className="mt-4 font-semibold text-gray-900">
              Secure Shopping
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Your account and shopping experience are designed with security
              in mind.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center">
            <div className="text-2xl">⚡</div>

            <h2 className="mt-4 font-semibold text-gray-900">
              Simple Experience
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              No unnecessary complexity. Just browse, choose, and shop.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Ready to explore?
        </h2>

        <p className="mt-2 text-gray-500">
          Take a look at our collection and discover your next favorite
          product.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Browse Products
        </Link>
      </section>
    </main>
  );
};

export default About;
