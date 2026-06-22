import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    countInStock: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const { data } = await api.post("/products", {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
      });

      setProducts((prev) => [data, ...prev]);
      setMessage("Product added successfully");

      setFormData({
        name: "",
        image: "",
        brand: "",
        category: "",
        description: "",
        price: "",
        countInStock: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <section className="admin-page">
  <div className="container">
    {message && <p className="success-message">{message}</p>}
    {error && <p className="error-message">{error}</p>}

    <div className="admin-shell">
      <main className="admin-main">
        <h1 className="admin-heading">Products</h1>

        <div className="admin-products-list">
          {products.map((product) => (
            <div className="admin-product-card" key={product._id}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.brand}</p>
              <p>{product.category}</p>
              <p>₹{product.price}</p>
              <button onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
          ))}
        </div>
      </main>

      <aside className="admin-sidebar">
        <h2 className="admin-subheading">Add Product</h2>

        <form onSubmit={handleSubmit} className="admin-product-form">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="countInStock"
            placeholder="Count In Stock"
            value={formData.countInStock}
            onChange={handleChange}
            required
          />
          <button type="submit">Add Product</button>
        </form>
      </aside>
    </div>
  </div>
</section>
  );
};

export default AdminProducts;