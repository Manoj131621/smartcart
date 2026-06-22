import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { userInfo, logoutUser } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__container">
        <div className="navbar__logo">
          <Link to="/">SmartCart</Link>
        </div>

        <nav className="navbar__links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>

          {userInfo ? (
            <>
              {userInfo?.isAdmin && (
                <Link to="/admin/products">Admin Products</Link>
              )}
              <Link to="/checkout">Checkout</Link>
              <Link to="/my-orders">My Orders</Link>
              <button onClick={logoutUser}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;