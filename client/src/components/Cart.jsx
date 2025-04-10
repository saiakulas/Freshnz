import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart } from "../redux/cartSlice";
import axios from "axios"; // For API calls
import {
  Box,
  Button,
  Text,
  Flex,
  IconButton,
  Heading,
  Spinner,
  Stack,
  Divider,
  Image,
  Grid,
} from "@chakra-ui/react";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa"; // Icons for minus, plus, and trash

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const status = useSelector((state) => state.cart.status);

  const BASE_URL = "https://freshnz.onrender.com/api/buyer"; // Backend base URL

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCart());
    }
  }, [dispatch, status]);

  const getAuthToken = () => {
    return localStorage.getItem("authToken"); // Replace with where your token is stored
  };

  const getHeaders = () => {
    const token = getAuthToken();
    return {
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  const incrementQuantity = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      await axios.put(
        `https://freshnz.onrender.com/api/buyer/cart/increment/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(fetchCart()); // Refetch the cart after incrementing
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    }
  };

  const decrementQuantity = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      await axios.put(
        `https://freshnz.onrender.com/api/buyer/cart/decrement/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(fetchCart()); // Refetch the cart after decrementing the quantity
    } catch (error) {
      console.error("Error decrementing quantity:", error);
    }
  };

  if (status === "failed") {
    return (
      <Box p={4}>
        <Heading as="h2" size="lg" mb={4}>
          Shopping Cart
        </Heading>
        <Text color="red.500">Failed to load cart. Please try again later.</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        Shopping Cart
      </Heading>
      {status === "loading" ? (
        <Flex justify="center" align="center" p={4}>
          <Spinner size="lg" />
          <Text ml={3}>Loading your cart...</Text>
        </Flex>
      ) : cart.length === 0 ? (
        <Box textAlign="center" p={8} bg="gray.50" borderRadius="md">
          <Text color="gray.600">Your cart is empty.</Text>
        </Box>
      ) : (
        <Grid
          templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
          gap={6}
          mb={6}
        >
          {cart.map((item) => {
            const { productId, quantity } = item;
            if (!productId?._id) {
              console.error("Cart item missing productId:", item);
              return null;
            }

            return (
              <Box
                key={productId._id}
                p={4}
                borderRadius="lg"
                boxShadow="md"
                mb={4}
                _hover={{ boxShadow: "lg" }}
                overflow="hidden"
                bg="white"
                border="1px"
                borderColor="gray.200"
              >
                <Flex direction="column" gap={4}>
                  <Image
                    src={productId.product_img_url} 
                    alt={productId.name}
                    borderRadius="lg"
                    boxSize="200px"
                    objectFit="cover"
                    mb={4}
                  />
                  <Stack spacing="3">
                    <Heading size="md" color="black">
                      {productId.name}
                    </Heading>
                    {/* Displaying Farm Name */}
                    <Text color="gray.500" fontSize="sm">
                      Farm: {productId.farmName}
                    </Text>
                    <Text color="blue.600" fontSize="xl">
                      ₹{productId.price}
                    </Text>
                  </Stack>
                  <Divider />
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap={4}>
                      <IconButton
                        onClick={() => decrementQuantity(productId._id)}
                        icon={<FaMinus />}
                        variant="outline"
                        colorScheme="teal"
                        aria-label="Decrement Quantity"
                        size="sm"
                      />
                      <Text fontSize="lg" fontWeight="bold">
                        {quantity}
                      </Text>
                      <IconButton
                        onClick={() => incrementQuantity(productId._id)}
                        icon={<FaPlus />}
                        variant="outline"
                        colorScheme="teal"
                        aria-label="Increment Quantity"
                        size="sm"
                      />
                    </Flex>
                    <IconButton
                      onClick={() => dispatch(removeFromCart(productId._id))}
                      icon={<FaTrashAlt />}
                      colorScheme="red"
                      aria-label="Remove Item"
                      size="sm"
                      variant="outline"
                    />
                  </Flex>
                </Flex>
              </Box>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default Cart;
