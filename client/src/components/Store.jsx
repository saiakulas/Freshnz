import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, addToCart } from "../redux/cartSlice";
import { fetchWishlist, addToWishlist } from "../redux/wishlistSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Stack,
  Text,
  Heading,
  ButtonGroup,
  useColorMode,
} from "@chakra-ui/react";

const Store = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const [products, setProducts] = useState([]);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
        dispatch(fetchCart());
        dispatch(fetchWishlist());
      } catch (err) {
        console.error("Error fetching products:", err);
        navigate("/login"); // Redirect if error occurs
      }
    };

    fetchProducts();
  }, [dispatch, navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>
        Store
      </Heading>

      <ButtonGroup spacing={4} mb={6}>
        <Button onClick={() => navigate("/cart")} colorScheme="blue">
          Go to Cart ({cart.length})
        </Button>
        <Button onClick={() => navigate("/wishlist")} colorScheme="blue">
          Go to Wishlist ({wishlist.length})
        </Button>
        <Button onClick={handleLogout} colorScheme="red">
          Logout
        </Button>
      </ButtonGroup>

      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
        {products.map((product) => (
          <Card key={product._id} maxW="sm" borderWidth="1px" borderRadius="lg" boxShadow="lg">
            <CardBody>
              <Image
                src={product.imageUrl} // Assuming the product has an imageUrl property
                alt={product.name}
                borderRadius="lg"
                objectFit="cover"
                boxSize="250px"
                mb={4}
              />
              <Stack mt="6" spacing="3">
                <Heading size="md" color={colorMode === "dark" ? "white" : "black"}>
                  {product.name}
                </Heading>
                <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                  {product.description}
                </Text>
                <Text color="blue.600" fontSize="xl">
                  ${product.price}
                </Text>
              </Stack>
            </CardBody>

            <Divider />
            <CardFooter>
              <ButtonGroup spacing="2">
                <Button
                  variant="solid"
                  colorScheme="teal"
                  onClick={() => dispatch(addToCart({ productId: product._id, quantity: 1 }))}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="ghost"
                  colorScheme="teal"
                  onClick={() => dispatch(addToWishlist(product._id))}
                >
                  Add to Wishlist
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Store;
