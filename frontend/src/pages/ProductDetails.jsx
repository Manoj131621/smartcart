import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
  };

  if (loading) return <p className="container">Loading...</p>;
  if (!product) return <p className="container">Product not found</p>;

  return (
    <section className="product-details-page container">
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>₹ {product.price}</p>
      <p>{product.description}</p>
      <p>{product.countInStock > 0 ? "In Stock" : "Out of Stock"}</p>

      <button onClick={handleAddToCart} disabled={product.countInStock === 0}>
        {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
    </section>
  );
};

export default ProductDetails;