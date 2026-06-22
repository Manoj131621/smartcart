import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-card__image">
        <img src={product.image} alt={product.name} />
      </Link>

      <div className="product-card__content">
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__category">{product.category}</p>
        <p className="product-card__brand">{product.brand}</p>
        <h4 className="product-card__price">₹{product.price}</h4>

        <button
          className="product-card__btn"
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
        >
          {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;