import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Flex, Stack } from "@chakra-ui/react";
import { useLocation } from "react-router-dom"; // to access the query parameters

const Billing = () => {
  const location = useLocation();
  const [totalPrice, setTotalPrice] = useState(null);

  useEffect(() => {
    // Parse query params to get the totalPrice
    const params = new URLSearchParams(location.search);
    const price = params.get("totalPrice");
    if (price) {
      setTotalPrice(parseFloat(price)); // Convert to float if needed
    }
  }, [location]);

  const handleConfirmPurchase = () => {
    // Here, you can implement payment processing or final confirmation
    alert("Order confirmed! Proceeding to payment.");
  };

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        Billing Information
      </Heading>
      {totalPrice === null ? (
        <Text color="red.500">Error: Total price not found.</Text>
      ) : (
        <Stack spacing={4} mb={4}>
          <Text fontSize="xl">Total Price: ₹{totalPrice}</Text>
          <Text fontSize="md" color="gray.600">
            Please confirm your order and proceed to payment.
          </Text>
        </Stack>
      )}
      <Flex justify="center">
        <Button colorScheme="blue" onClick={handleConfirmPurchase}>
          Confirm Purchase
        </Button>
      </Flex>
    </Box>
  );
};

export default Billing;
