import { useEffect, useState } from "react";
import api from "../services/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <section className="orders-page container">
      <h1>My Orders</h1>

      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id}>
            <p>Order ID: {order._id}</p>
            <p>Total: ₹ {order.totalPrice}</p>
            <p>Paid: {order.isPaid ? "Yes" : "No"}</p>
          </div>
        ))
      ) : (
        <p>No orders found</p>
      )}
    </section>
  );
};

export default MyOrders;