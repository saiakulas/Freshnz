import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, addToCart } from "../redux/cartSlice";
import { fetchWishlist, addToWishlist } from "../redux/wishlistSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Stack,
  Image,
  Text,
  Heading,
  ButtonGroup,
  useColorMode,
  IconButton,
  Badge,
  Divider,
  Select,
  Center,
} from "@chakra-ui/react";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";

const Store = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const [products, setProducts] = useState([]);
  const [categories] = useState(["Eggs", "Fruits", "Vegetables","meat","Honey"]);
  const [farms] = useState(["Green Valley Farm", "Vineyard Harvest", "Vridha Farms"]);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleCategoryChange = async (event) => {
    const category = event.target.value;
    try {
      const res = await axios.get(`http://localhost:5000/api/products/category/${category}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products by category:", err);
    }
  };

  const handleFarmChange = async (event) => {
    const farmName = event.target.value;
    try {
      const res = await axios.get(`http://localhost:5000/api/products/farm/${farmName}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products by farm:", err);
    }
  };

  return (
    <Box p={4}>
      {/* Heading with Cart, Wishlist, and Logout Icons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="lg">Freshnz</Heading>

        <Box display="flex" gap={4}>
          <Select
            placeholder="Shop by Category"
            onChange={handleCategoryChange}
            width="200px"
            size="sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>

          <Select
            placeholder="Shop by Farm"
            onChange={handleFarmChange}
            width="200px"
            size="sm"
          >
            {farms.map((farm) => (
              <option key={farm} value={farm}>
                {farm}
              </option>
            ))}
          </Select>

          {/* Cart Icon with Badge */}
          <Box position="relative">
            <IconButton
              icon={<FaCartPlus />}
              onClick={() => navigate("/cart")}
              aria-label="Go to Cart"
              color="black"
              size="sm"
            />
            <Badge
              bg="#54AC00"
              color="white"
              borderRadius="full"
              px={2}
              position="absolute"
              top="-5px"
              right="-5px"
            >
              {cart.length}
            </Badge>
          </Box>

          {/* Wishlist Icon with Badge */}
          <Box position="relative">
            <IconButton
              icon={<FaHeart />}
              onClick={() => navigate("/wishlist")}
              aria-label="Go to Wishlist"
              color="black"
              size="sm"
            />
            <Badge
              bg="#54AC00"
              color="white"
              borderRadius="full"
              px={2}
              position="absolute"
              top="-5px"
              right="-5px"
            >
              {wishlist.length}
            </Badge>
          </Box>

          {/* Logout Icon */}
          <IconButton
            icon={<IoMdLogOut />}
            onClick={handleLogout}
            aria-label="Logout"
            size="lg"
            color="black"
            bg="transparent"
            _hover={{
              bg: "grey.200",
            }}
            fontSize="25px"
          />
        </Box>
      </Box>

      {/* Product Grid */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))" gap={6}>
        {products.map((product) => (
          <Box
            key={product._id}
            borderRadius="lg"
            boxShadow="md"
            position="relative"
            overflow="hidden"
            height="450px"
          >
            {/* Image */}
            <Center>
              <Image
                src={product.product_img_url}
                alt={product.name}
                borderRadius="lg"
                objectFit="cover"
                boxSize="220px"
                mb={4}
              />
            </Center>

            {/* Product Info */}
            <Stack mt="6" spacing="3" p={4} flex="1">
              <Heading size="md" color={colorMode === "dark" ? "white" : "black"}>
                {product.name}
              </Heading>
              <Text color="blue.600" fontSize="xl">
                ${product.price}
              </Text>
            </Stack>

            <Divider />

            {/* Add to Cart and Wishlist heart icon */}
            <Box p={4}>
              <ButtonGroup spacing="2" w="100%" justifyContent="space-between">
                <Button
                  variant="solid"
                  backgroundColor="#54AC00"
                  color="white"
                  onClick={() => dispatch(addToCart({ productId: product._id, quantity: 1 }))}
                >
                  Add to Cart
                </Button>

                <IconButton
                  icon={<FaHeart />}
                  onClick={() => dispatch(addToWishlist(product._id))}
                  aria-label="Add to Wishlist"
                  color="black"
                  size="sm"
                />
              </ButtonGroup>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Store;
