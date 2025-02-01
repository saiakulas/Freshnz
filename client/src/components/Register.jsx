import React, { useState } from 'react';
import { Box, Button, Card, CardBody, Center, Alert, AlertIcon, AlertTitle, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorMode, CircularProgress } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { colorMode } = useColorMode();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      alert(res.data.message);
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Flex justify="center" align="center" height="80vh">
        <Center>
          <Stack spacing="4">
            <Heading fontWeight="500" fontSize="30px" letterSpacing="-0.5px">Register</Heading>

            <Card bg="#f6f8fa" variant="outline" borderColor="#d8dee4" w="308px" size="lg" borderRadius={8} boxShadow="lg">
              <CardBody>
                <form onSubmit={handleSubmit}>
                  {error && (
                    <Alert status="error" variant="solid">
                      <AlertIcon />
                      <AlertTitle>{error}</AlertTitle>
                    </Alert>
                  )}

                  <Stack spacing="4">
                    <FormControl isRequired>
                      <FormLabel size="sm" color={colorMode === 'dark' ? 'black' : 'black'}>Username</FormLabel>
                      <Input
                        name="username"
                        type="text"
                        bg="white"
                        borderColor="#d8dee4"
                        size="sm"
                        borderRadius="6px"
                        color={colorMode === 'dark' ? 'black' : 'black'}
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel size="sm" color={colorMode === 'dark' ? 'black' : 'black'}>Email Address</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        bg="white"
                        borderColor="#d8dee4"
                        size="sm"
                        borderRadius="6px"
                        color={colorMode === 'dark' ? 'black' : 'black'}
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel size="sm" color={colorMode === 'dark' ? 'black' : 'black'}>Password</FormLabel>
                      <Input
                        name="password"
                        type="password"
                        bg="white"
                        borderColor="#d8dee4"
                        size="sm"
                        borderRadius="6px"
                        color={colorMode === 'dark' ? 'black' : 'black'}
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      bg="#2da44e"
                      color="white"
                      size="sm"
                      _hover={{ bg: '#2c974b' }}
                      _active={{ bg: '#298e46' }}
                    >
                      {isLoading ? (
                        <CircularProgress isIndeterminate size="24px" color="teal" />
                      ) : (
                        'Register'
                      )}
                    </Button>
                  </Stack>
                </form>
              </CardBody>
            </Card>

            <p>
              Already have an account?{' '}
              <Button as="a" href="/login" variant="link" colorScheme="teal" size="sm">
                Login
              </Button>
            </p>
          </Stack>
        </Center>
      </Flex>
    </Box>
  );
};

export default Register;
