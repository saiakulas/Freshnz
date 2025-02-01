import React from 'react';
import { Box, Button, Center, Heading, Stack, useColorMode } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  return (
    <Box height="100vh" display="flex" justifyContent="center" alignItems="center" bg={colorMode === 'dark' ? 'gray.800' : 'gray.100'}>
      <Center>
        <Stack spacing={4} textAlign="center">
          <Heading fontSize="3xl" fontWeight="bold" color={colorMode === 'dark' ? 'white' : 'black'}>
            Welcome to the Store
          </Heading>

          <Stack direction="row" spacing={4} justify="center">
            <Button
              colorScheme="teal"
              size="lg"
              onClick={() => navigate('/login')}
              _hover={{ bg: 'teal.600' }}
            >
              Login
            </Button>
            <Button
              colorScheme="teal"
              size="lg"
              onClick={() => navigate('/register')}
              _hover={{ bg: 'teal.600' }}
            >
              Register
            </Button>
          </Stack>
        </Stack>
      </Center>
    </Box>
  );
};

export default Home;
