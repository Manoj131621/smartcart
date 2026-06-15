import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="container navbar__wrapper">
        <Link to="/" className="navbar__logo">
          SmartCart
        </Link>

        <nav className="navbar__links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          <NavLink to="/my-orders">My Orders</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;