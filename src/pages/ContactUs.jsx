import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Text,
  useToast,
  Container,
  Heading,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const MotionBox = motion(Box);

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

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(API_ENDPOINTS.contact.send, {
        name,
        email,
        message
      });

      if (response.data.success) {
        toast({
          title: 'Message sent!',
          description: 'We will get back to you as soon as possible.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Clear form
        setName('');
        setEmail('');
        setMessage('');
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setError(
        error.response?.data?.message ||
        error.message ||
        'Failed to send message. Please try again later.'
      );
      
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again later.',
        status: 'error',
        duration: 5000,
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
              Contact Us
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
              Have a question or feedback? We'd love to hear from you.
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
            {error && (
              <Alert status="error" mb={6} borderRadius="md">
                <AlertIcon />
                <Box flex="1">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription display="block">
                    {error}
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={{ base: 6, md: 8 }}>
                <FormControl isRequired variants={itemVariants}>
                  <FormLabel fontSize={{ base: 'md', md: 'lg' }}>Name</FormLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
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

                <FormControl isRequired variants={itemVariants}>
                  <FormLabel fontSize={{ base: 'md', md: 'lg' }}>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
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

                <FormControl isRequired variants={itemVariants}>
                  <FormLabel fontSize={{ base: 'md', md: 'lg' }}>Message</FormLabel>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message"
                    size="lg"
                    minH="200px"
                    fontSize={{ base: 'md', md: 'lg' }}
                    rounded="xl"
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
                  loadingText="Sending..."
                  variants={itemVariants}
                >
                  Send Message
                </Button>
              </VStack>
            </form>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
} 