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
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionContainer = motion(Container);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData = await login(email, password);
      if (userData.role === 'admin') {
        throw new Error('Please use the admin portal to login as an administrator.');
      }
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to login',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      width="100vw"
      minH="100vh"
      bg={useColorModeValue('gray.50', 'gray.900')}
      py={{ base: 12, md: 20 }}
      overflow="hidden"
      position="relative"
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

      <Container maxW={{ base: "100%", md: "90%", lg: "80%" }} px={{ base: 4, md: 8 }} position="relative">
        <VStack spacing={{ base: 6, md: 10 }} align="stretch">
          <Box textAlign="center">
            <Heading
              as={motion.h1}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              fontSize={{ base: '2xl', sm: '4xl', md: '5xl', lg: '6xl' }}
              mb={{ base: 2, md: 3 }}
              bgGradient="linear(to-r, #667eea, #764ba2)"
              bgClip="text"
              lineHeight={{ base: "120%", md: "110%" }}
            >
              Welcome Back
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
              color={useColorModeValue('gray.500', 'gray.400')}
              maxW={{ base: "100%", md: "90%", lg: "80%" }}
              mx="auto"
              as={motion.p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              to continue to Resume Optimizer
            </Text>
          </Box>

          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="show"
            w="full"
            maxW={{ base: "100%", sm: "85%", md: "70%", lg: "50%" }}
            mx="auto"
            p={{ base: 8, md: 10, lg: 12 }}
            borderWidth={1}
            borderRadius="xl"
            shadow="xl"
            bg={useColorModeValue('white', 'gray.800')}
            borderColor={useColorModeValue('gray.100', 'gray.700')}
            _hover={{
              transform: 'translateY(-8px)',
              shadow: '2xl',
              borderColor: '#667eea',
            }}
            transition="all 0.3s ease"
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={{ base: 6, md: 8 }}>
                <FormControl id="email" isRequired variants={itemVariants}>
                  <FormLabel fontSize={{ base: 'md', md: 'lg' }}>Email address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="lg"
                    height={{ base: 12, md: 14 }}
                    fontSize={{ base: 'md', md: 'lg' }}
                    rounded="full"
                    borderWidth={2}
                    _hover={{
                      borderColor: '#667eea',
                    }}
                    _focus={{
                      borderColor: '#764ba2',
                      boxShadow: '0 0 0 1px #764ba2',
                    }}
                  />
                </FormControl>
                <FormControl id="password" isRequired variants={itemVariants}>
                  <FormLabel fontSize={{ base: 'md', md: 'lg' }}>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="lg"
                    height={{ base: 12, md: 14 }}
                    fontSize={{ base: 'md', md: 'lg' }}
                    rounded="full"
                    borderWidth={2}
                    _hover={{
                      borderColor: '#667eea',
                    }}
                    _focus={{
                      borderColor: '#764ba2',
                      boxShadow: '0 0 0 1px #764ba2',
                    }}
                  />
                </FormControl>
                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  height={{ base: 12, md: 14 }}
                  fontSize={{ base: 'md', md: 'lg' }}
                  rounded="full"
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                    bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
                  }}
                  transition="all 0.2s"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  variants={itemVariants}
                >
                  Sign in
                </Button>
              </VStack>
            </form>
          </MotionBox>

          <Box
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            textAlign="center"
            mt={{ base: 6, md: 8 }}
          >
            <Text 
              fontSize={{ base: 'md', md: 'lg' }}
              color={useColorModeValue('gray.600', 'gray.400')}
            >
              Don't have an account?{' '}
              <ChakraLink
                as={Link}
                to="/register"
                color="#667eea"
                _hover={{ 
                  color: '#764ba2',
                  textDecoration: 'none'
                }}
                fontWeight="semibold"
                transition="all 0.2s"
              >
                Register
              </ChakraLink>
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}