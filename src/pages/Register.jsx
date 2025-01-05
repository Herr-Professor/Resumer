import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  Container,
  Heading,
  Link as ChakraLink,
  useColorModeValue
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionText = motion(Text);

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const userData = await register(name, email, password);
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to register',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box width="100vw" minH="100vh" overflowX="hidden">
      <Box
        bg={useColorModeValue('gray.50', 'gray.900')}
        position="relative"
        overflow="hidden"
        width="100%"
        minH="100vh"
        display="flex"
        alignItems="center"
      >
        {/* Animated Background Elements */}
        <MotionBox
          position="absolute"
          top="-20%"
          left="-10%"
          width="120%"
          height="140%"
          bg="linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)"
          initial={{ rotate: -5, scale: 1.2 }}
          animate={{ 
            rotate: 5,
            scale: 1,
            transition: { 
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        />
        <MotionBox
          position="absolute"
          top="10%"
          right="-20%"
          width={{ base: "60%", md: "40%" }}
          height={{ base: "60%", md: "40%" }}
          borderRadius="full"
          bg="linear-gradient(135deg, rgba(102,126,234,0.2) 0%, rgba(118,75,162,0.2) 100%)"
          initial={{ y: 0 }}
          animate={{ 
            y: [0, -30, 0],
            transition: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />

        <Container maxW="100%" px={{ base: 4, md: 8 }} centerContent>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            bg={useColorModeValue('white', 'gray.800')}
            rounded="xl"
            shadow="xl"
            p={{ base: 6, md: 8 }}
            width={{ base: "95%", sm: "85%", md: "70%", lg: "50%" }}
            maxWidth="600px"
          >
            <Stack spacing={{ base: 4, md: 6 }}>
              <Stack align="center" spacing={{ base: 2, md: 3 }}>
                <Heading
                  fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  bgClip="text"
                >
                  Create Account
                </Heading>
                <MotionText
                  color="gray.500"
                  fontSize={{ base: 'md', md: 'lg' }}
                  textAlign="center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  to get started with Resume Optimizer
                </MotionText>
              </Stack>

              <form onSubmit={handleSubmit}>
                <Stack spacing={{ base: 4, md: 5 }}>
                  <FormControl id="name" isRequired>
                    <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Full Name</FormLabel>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      size={{ base: 'md', md: 'lg' }}
                      bg={useColorModeValue('white', 'gray.700')}
                      borderColor={useColorModeValue('gray.200', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('gray.300', 'gray.500')
                      }}
                    />
                  </FormControl>

                  <FormControl id="email" isRequired>
                    <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Email address</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      size={{ base: 'md', md: 'lg' }}
                      bg={useColorModeValue('white', 'gray.700')}
                      borderColor={useColorModeValue('gray.200', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('gray.300', 'gray.500')
                      }}
                    />
                  </FormControl>

                  <FormControl id="password" isRequired>
                    <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      size={{ base: 'md', md: 'lg' }}
                      bg={useColorModeValue('white', 'gray.700')}
                      borderColor={useColorModeValue('gray.200', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('gray.300', 'gray.500')
                      }}
                    />
                  </FormControl>

                  <FormControl id="confirmPassword" isRequired>
                    <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      size={{ base: 'md', md: 'lg' }}
                      bg={useColorModeValue('white', 'gray.700')}
                      borderColor={useColorModeValue('gray.200', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('gray.300', 'gray.500')
                      }}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    size={{ base: 'md', md: 'lg' }}
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    color="white"
                    _hover={{
                      bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                    isLoading={isLoading}
                    mt={{ base: 4, md: 6 }}
                  >
                    Sign up
                  </Button>
                </Stack>
              </form>

              <Stack pt={{ base: 4, md: 6 }}>
                <Text align="center" fontSize={{ base: 'sm', md: 'md' }}>
                  Already have an account?{' '}
                  <ChakraLink
                    as={Link}
                    to="/login"
                    color="#667eea"
                    _hover={{ 
                      color: '#764ba2',
                      textDecoration: 'none'
                    }}
                    fontWeight="medium"
                  >
                    Login
                  </ChakraLink>
                </Text>
              </Stack>
            </Stack>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
}