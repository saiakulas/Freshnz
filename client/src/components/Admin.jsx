import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, Button, FormControl, FormLabel, Input, 
  Textarea, Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalBody, ModalCloseButton, useDisclosure, 
  useToast 
} from '@chakra-ui/react';

const Admin = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    product_img_url: '',
    category: '',
    farmName: '',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.post('https://freshnz.onrender.com/api/products/add', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: 'Product added successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
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
      toast({
        title: 'Error adding product',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Box textAlign="center" mb={5}>
        <h2 className="admin-title">Admin Dashboard</h2>
        <p>Welcome, Admin!</p>
      </Box>

      {/* Button to trigger modal */}
      <Button colorScheme="teal" onClick={onOpen}>
        Add New Product
      </Button>

      {/* Modal for adding a new product */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl id="name" mb={3} isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl id="description" mb={3} isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl id="price" mb={3} isRequired>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl id="discount" mb={3} isRequired>
                <FormLabel>Discount</FormLabel>
                <Input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl id="product_img_url" mb={3}>
                <FormLabel>Product Image URL</FormLabel>
                <Input
                  type="text"
                  name="product_img_url"
                  value={formData.product_img_url}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl id="category" mb={3} isRequired>
                <FormLabel>Category</FormLabel>
                <Input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl id="farmName" mb={3} isRequired>
                <FormLabel>Farm Name</FormLabel>
                <Input
                  type="text"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                />
              </FormControl>

              <Button type="submit" colorScheme="teal" width="100%" mt={4}>
                Add Product
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Admin;
