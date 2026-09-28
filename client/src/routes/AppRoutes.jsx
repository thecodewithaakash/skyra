import { Routes, Route } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductView from "../components/ProductView";
import Profile from "../pages/Profile";
import About from "../pages/About";
import Login from "../components/login";
import Register from "../components/register";
import AddProduct from "../components/AddProduct";
import SellerProducts from "../pages/SellerProducts";

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductView />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<SellerProducts />} />
        <Route path="/seller/products/new" element={<AddProduct />} />
        <Route path="/seller/products/:id/edit" element={<AddProduct />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </>
  );
}

export default AppRoutes;
