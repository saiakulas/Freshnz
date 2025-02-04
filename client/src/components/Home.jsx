import React, { useState } from 'react';
import { Box, Button, Center, Heading, Stack, Text, SimpleGrid, Image, useColorMode, useBreakpointValue, Fade, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Fresh Orange Nagpur',
    image: 'https://ecolife.posthemes.com/demo1/organic2/39-large_default/fresh-orange-nagpur.jpg',
    description: 'This is a trending product.',
  },
  {
    id: 2,
    name: 'Kiwi Fruit Single',
    image: 'https://ecolife.posthemes.com/demo1/organic2/49-large_default/kiwi-fruit-single.jpg',
    description: 'This is a trending product.',
  },
  {
    id: 3,
    name: 'Melon Blenheim Orange',
    image: 'https://ecolife.posthemes.com/demo1/organic2/83-large_default/melon-blenheim-orange.jpg',
    description: 'This is a trending product.',
  },
  {
    id: 4,
    name: 'Fresh Fruit',
    image: 'https://th.bing.com/th/id/OIP.4Z8A0P7uBhm3xSDIcXfClgHaHa?rs=1&pid=ImgDetMain',
    description: 'This is a trending product.',
  },
  {
    id: 5,
    name: 'Strawberries Pack 300g',
    image: 'https://ecolife.posthemes.com/demo1/organic2/86-large_default/strawberries-pack-300g.jpg',
    description: 'This is a trending product.',
  },
  {
    id: 6,
    name: 'Strawberries Pack 300g',
    image: 'https://ecolife.posthemes.com/demo1/organic2/87-large_default/strawberries-pack-300g.jpg',
    description: 'This is a trending product.',
  },
  {
    id: 7,
    name: 'Fresh Lamb Stew Meat',
    image: 'https://cdn.shopify.com/s/files/1/2233/6197/products/75516_-_Lamb_Stew_Meat-1_1024x1024.jpg?v=1565120705',
    description: 'This is a trending product.',
  },
  {
    id: 8,
    name: 'Fresh Fruit',
    image: 'https://th.bing.com/th/id/OIP.7C_MoXLZzwEXB7WoSw_fkwAAAA?rs=1&pid=ImgDetMain',
    description: 'This is a trending product.',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { isOpen, onToggle } = useDisclosure();
  
  // Fade effect for image transition
  const [show, setShow] = useState(true);
  const toggleFade = () => setShow(!show);

  const productColumns = useBreakpointValue({ base: 1, md: 2, lg: 4 });

  return (
    <Box bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'} minHeight="100vh">
      {/* NavBar */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        p={4} 
        bg={colorMode === 'dark' ? 'gray.800' : 'white'} 
        borderBottom="1px solid" 
        borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.300'}
      >
        <Heading size="md" color={colorMode === 'dark' ? 'white' : 'black'}>Store</Heading>
        <Stack direction="row" spacing={4}>
          <Button colorScheme="teal" variant="link" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button colorScheme="teal" variant="link" onClick={() => navigate('/register')}>
            Register
          </Button>
        </Stack>
      </Box>

      {/* Hero Section with Image Slider */}
      <Box
        position="relative"
        bgGradient="linear(to-r, teal.500, green.400)"
        color="white"
        py={20}
        px={10}
        textAlign="center"
        overflow="hidden"
      >
        <Fade in={show}>
          <Box>
            <Heading fontSize="5xl" fontWeight="bold" mb={4} transition="all 0.5s ease">
              Welcome to the Store
            </Heading>
            <Text fontSize="2xl" mb={8}>
              Explore the best products curated just for you!
            </Text>
          </Box>
        </Fade>

        <Button
          colorScheme="teal"
          size="lg"
          mb={4}
          onClick={toggleFade}
          _hover={{ bg: 'teal.600' }}
        >
          See What's New
        </Button>
      </Box>

      {/* Products Section: Trending and New Arrivals */}
      <Box py={16} bg={colorMode === 'dark' ? 'gray.800' : 'white'}>
        <Heading fontSize="3xl" mb={8} textAlign="center">
          Trending Products
        </Heading>
        <SimpleGrid columns={[1, 2, 2, 4]} spacing={10} px={8}>
          {products
            .filter((product) => product.description.includes('trending'))
            .map((product) => (
              <Box
                key={product.id}
                bg={colorMode === 'dark' ? 'gray.700' : 'white'}
                borderRadius="md"
                boxShadow="lg"
                overflow="hidden"
                p={4}
                textAlign="center"
                transition="transform 0.3s ease"
                _hover={{ transform: 'scale(1.05)' }}
              >
                <Center>
                  <Image
                    src={product.image}
                    alt={product.name}
                    boxSize="200px"
                    objectFit="cover"
                    borderRadius="md"
                    mb={4}
                  />
                </Center>
                <Heading fontSize="lg" mb={2}>
                  {product.name}
                </Heading>
                <Text mb={4}>{product.description}</Text>
                <Button colorScheme="teal" size="sm" onClick={() => alert('View product')}>
                  View Product
                </Button>
              </Box>
            ))}
        </SimpleGrid>
      </Box>

     

      {/* Footer Section */}
      <Box bg={colorMode === 'dark' ? 'gray.900' : 'gray.200'} py={6}>
        <Center>
          <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.400' : 'gray.700'}>
            © 2023 Store. All rights reserved.
          </Text>
        </Center>
      </Box>
    </Box>
  );
};

export default Home;
