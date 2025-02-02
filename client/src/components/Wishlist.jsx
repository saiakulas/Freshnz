import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { Box, Button, Heading, Text, Image, Stack, IconButton, Grid, Spinner } from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa"; // Trash icon for removing items

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const status = useSelector((state) => state.wishlist.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchWishlist());
    }
  }, [dispatch, status]);

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        Wishlist
      </Heading>
      {status === "loading" ? (
        <Box display="flex" justifyContent="center" alignItems="center" p={4}>
          <Spinner size="lg" />
          <Text ml={3}>Loading your wishlist...</Text>
        </Box>
      ) : wishlist.length === 0 ? (
        <Box textAlign="center" p={8} bg="gray.50" borderRadius="md">
          <Text color="gray.600">Your wishlist is empty.</Text>
        </Box>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
          {wishlist.map((item) => {
            const product = item.productId;
            if (!product) {
              return null; // Skip this item if there's no productId
            }

            return (
              <Box
                key={item._id}
                p={4}
                borderRadius="lg"
                boxShadow="md"
                mb={4}
                bg="white"
                border="1px"
                borderColor="gray.200"
                _hover={{ boxShadow: "lg" }}
                overflow="hidden"
              >
                <Image
                  src={product.product_img_url}
                  alt={product.name}
                  borderRadius="lg"
                  boxSize="200px"
                  objectFit="cover"
                  mb={4}
                />
                <Stack spacing="3">
                  <Heading size="md" color="black">
                    {product.name}
                  </Heading>
                  <Text color="gray.500" fontSize="sm">
                    {product.description}
                  </Text>
                  <Text color="blue.600" fontSize="xl">
                    ₹{product.price}
                  </Text>
                </Stack>
                <Box mt={4}>
                  <IconButton
                    onClick={() => dispatch(removeFromWishlist(product._id))}
                    icon={<FaTrashAlt />}
                    colorScheme="red"
                    aria-label="Remove from Wishlist"
                    size="sm"
                    variant="outline"
                  />
                </Box>
              </Box>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default Wishlist;
