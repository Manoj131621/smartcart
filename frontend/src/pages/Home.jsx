import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/common/ProductCard";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (err) {
        console.error(err.message);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="container">Loading products...</p>;
  if (error) return <p className="container">{error}</p>;

  const latestProducts = products.slice(0, 4);

  return (
    <section className="home-page container">
      <h1>Latest Products</h1>

      <div className="products-grid">
        {latestProducts.length > 0 ? (
          latestProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <Link to="/products">View All Products</Link>
      </div>
    </section>
  );
};

export default Home;