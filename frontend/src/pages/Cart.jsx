import { useEffect, useState } from "react";
import api from "../services/api";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (productId, qty) => {
    try {
      await api.put(`/cart/${productId}`, { qty: Number(qty) });
      fetchCart();
    } catch (error) {
      console.error(error.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      fetchCart();
    } catch (error) {
      console.error(error.message);
    }
  };

  const totalPrice =
    cart?.items?.reduce((acc, item) => acc + item.price * item.qty, 0) || 0;

  if (loading) return <p className="container">Loading cart...</p>;

  return (
    <section className="cart-page container">
      <h1>Your Cart</h1>

      {cart?.items?.length ? (
        <>
          {cart.items.map((item) => (
            <div key={item.product} className="cart-item">
              <p>{item.name}</p>
              <p>₹ {item.price}</p>

              <input
                type="number"
                min="1"
                value={item.qty}
                onChange={(e) => updateQty(item.product, e.target.value)}
              />

              <p>Subtotal: ₹ {item.price * item.qty}</p>

              <button onClick={() => removeItem(item.product)}>Remove</button>
            </div>
          ))}

          <h2>Total: ₹ {totalPrice}</h2>
          <button>Proceed to Checkout</button>
        </>
      ) : (
        <p>Cart is empty</p>
      )}
    </section>
  );
};

export default Cart;