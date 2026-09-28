import { NavLink } from "react-router";

const Home = () => {
  return (
    <main className="bg-white">
      <section className="border-b bg-gray-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">

          <div>
            <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-600">
              Welcome to Skyra
            </span>

            <h1 className="mt-5 max-w-xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Everything you need,
              <span className="text-indigo-600"> all in one place.</span>
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-8 text-gray-600">
              Discover quality products at great prices. Simple shopping,
              secure checkout, and products you'll love.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <NavLink
                to="/products"
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Shop Now
              </NavLink>

              <NavLink
                to="/about"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Learn More
              </NavLink>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="flex h-72 w-full max-w-md items-center justify-center rounded-2xl bg-indigo-600 shadow-xl sm:h-80">
              <div className="text-center text-white">
                <div className="text-7xl">🛍️</div>

                <p className="mt-4 text-xl font-semibold">
                  Shop smarter.
                </p>

                <p className="mt-1 text-indigo-200">
                  Live better.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

  
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-xl border border-gray-200 p-6">
            <div className="text-2xl">🚚</div>

            <h3 className="mt-4 font-semibold text-gray-900">
              Fast Delivery
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Get your favorite products delivered quickly and safely.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-6">
            <div className="text-2xl">🔒</div>

            <h3 className="mt-4 font-semibold text-gray-900">
              Secure Shopping
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Your account and personal information are kept secure.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-6">
            <div className="text-2xl">✨</div>

            <h3 className="mt-4 font-semibold text-gray-900">
              Quality Products
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Explore products selected for a simple and better shopping
              experience.
            </p>
          </div>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              Explore our collection
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Featured Products
            </h2>

            <p className="mt-2 text-gray-500">
              Discover some of our popular products.
            </p>
          </div>

          <NavLink
            to="/products"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View all products →
          </NavLink>
        </div>

        {/* Temporary Product Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="flex h-52 items-center justify-center bg-gray-100">
                <span className="text-4xl">🛍️</span>
              </div>

              <div className="p-4">
                <h3 className="font-medium text-gray-900">
                  Product {item}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Product description
                </p>

                <p className="mt-3 font-semibold text-gray-900">
                  $49.99
                </p>
              </div>
            </div>
          ))}

        </div>
      </section>

  
      <section className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to start shopping?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            Browse our products and find something you'll love.
          </p>

          <NavLink
            to="/products"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Explore Products
          </NavLink>
        </div>
      </section>

    </main>
  );
};

export default Home;
