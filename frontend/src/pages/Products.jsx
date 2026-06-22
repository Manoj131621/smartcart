import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const {
    addToCart,
    incrementQty,
    decrementQty,
    getItemQuantity,
  } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="products-page container">
      <h1>SmartCart Products</h1>

      <div className="products-grid">
        {products.map((product) => {
          const qty = getItemQuantity(product._id);

          return (
            <div className="product-card" key={product._id}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>₹ {product.price}</p>

              <Link to={`/product/${product._id}`}>View Details</Link>

              {qty === 0 ? (
                <button
                  className="add-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              ) : (
                <>
                  <div className="qty-controls">
                    <button onClick={() => decrementQty(product._id)}>-</button>
                    <span>{qty}</span>
                    <button onClick={() => incrementQty(product._id)}>+</button>
                  </div>

                  <button
                    className="checkout-btn"
                    onClick={() => navigate("/checkout")}
                  >
                    Checkout
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Products;