import React, { useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    product_img_url: '',
    category: '',
    farmName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.post('http://localhost:5000/api/products/add', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Product added successfully!');
      setShowModal(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        discount: '',
        product_img_url: '',
        category: '',
        farmName: '',
      });
    } catch (error) {
      alert('Error adding product: ' + error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin!</p>

      {/* Button to trigger modal */}
      <button onClick={() => setShowModal(true)}>
        Add New Product
      </button>

      {/* Modal for adding a new product */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h3>Add New Product</h3>
            <form onSubmit={handleSubmit}>
              <label>Product Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <label>Discount:</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                required
              />
              <label>Product Image URL:</label>
              <input
                type="text"
                name="product_img_url"
                value={formData.product_img_url}
                onChange={handleChange}
              />
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
              <label>Farm Name:</label>
              <input
                type="text"
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                required
              />
              <button type="submit">
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
