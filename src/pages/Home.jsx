import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  Flex,
  SimpleGrid,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaCheck, FaFileAlt, FaRocket, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);

export default function Home() {
  const features = [
    {
      icon: FaFileAlt,
      title: 'ATS-Friendly Format',
      text: 'Our optimized resumes are designed to pass through Applicant Tracking Systems.'
    },
    {
      icon: FaRocket,
      title: 'Professional Design',
      text: 'Stand out with modern, clean layouts that catch recruiters\' attention.'
    },
    {
      icon: FaClock,
      title: 'Quick Turnaround',
      text: 'Get your optimized resume back in as little as 24 hours.'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Box width="100vw" minH="100vh" overflowX="hidden">
      {/* Hero Section */}
      <Box
        bg={useColorModeValue('gray.50', 'gray.900')}
        position="relative"
        overflow="hidden"
        width="100%"
        minH={{ base: "90vh", md: "80vh" }}
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
          <Stack
            spacing={{ base: 6, md: 10 }}
            py={{ base: 10, md: 20 }}
            maxW={{ base: "100%", md: "90%", lg: "80%" }}
            width="100%"
            textAlign="center"
          >
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Heading
                fontWeight={600}
                fontSize={{ base: '2xl', sm: '4xl', md: '5xl', lg: '6xl' }}
                lineHeight={{ base: "120%", md: "110%" }}
                px={{ base: 4, md: 0 }}
              >
                Get Your Resume <br />
                <MotionText
                  as="span"
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  bgClip="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Professionally Optimized
                </MotionText>
              </Heading>
            </MotionBox>

            <MotionText
              color="gray.500"
              fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
              maxW={{ base: "100%", md: "90%", lg: "80%" }}
              mx="auto"
              px={{ base: 4, md: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Stand out from the crowd with our professional resume optimization service. 
              We help you create an ATS-friendly resume that highlights your strengths and 
              gets you noticed by employers.
            </MotionText>

            <Stack
              direction={{ base: 'column', sm: 'row' }}
              spacing={{ base: 4, md: 6 }}
              justify="center"
              w="100%"
              px={{ base: 4, md: 0 }}
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link to="/upload" style={{ width: '100%', maxWidth: '200px' }}>
                <Button
                  w="100%"
                  rounded="full"
                  size={{ base: "md", md: "lg" }}
                  px={8}
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                    bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
                  }}
                  transition="all 0.2s"
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/services" style={{ width: '100%', maxWidth: '200px' }}>
                <Button
                  w="100%"
                  rounded="full"
                  size={{ base: "md", md: "lg" }}
                  px={8}
                  leftIcon={<Icon as={FaFileAlt} h={5} w={5} />}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Learn More
                </Button>
              </Link>
            </Stack>
            
            {/* Admin Portal Link */}
            <Box mt={4}>
              <Link to="/admin-login">
                <Text
                  fontSize="sm"
                  color="gray.500"
                  _hover={{ color: 'gray.700', textDecoration: 'underline' }}
                  transition="all 0.2s"
                >
                  Admin Portal →
                </Text>
              </Link>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box 
        py={{ base: 12, md: 20 }} 
        width="100%" 
        bg={useColorModeValue('white', 'gray.800')}
      >
        <Container maxW="100%" px={{ base: 4, md: 8 }} centerContent>
          <VStack 
            spacing={{ base: 8, md: 12 }}
            width="100%"
            maxW={{ base: "100%", md: "90%", lg: "80%" }}
          >
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              width="100%"
            >
              <VStack spacing={4} textAlign="center">
                <Heading
                  fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  bgClip="text"
                >
                  Why Choose Us
                </Heading>
                <Text 
                  color="gray.500" 
                  fontSize={{ base: 'md', md: 'lg' }}
                  maxW={{ base: "100%", md: "90%", lg: "70%" }}
                >
                  Our professional resume optimization service helps you stand out in today's competitive job market
                </Text>
              </VStack>
            </MotionBox>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={{ base: 6, md: 8, lg: 10 }}
              width="100%"
              as={motion.div}
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <MotionBox
                  key={index}
                  variants={item}
                  bg={useColorModeValue('white', 'gray.800')}
                  p={{ base: 6, md: 8 }}
                  rounded="xl"
                  shadow="base"
                  border="1px"
                  borderColor={useColorModeValue('gray.100', 'gray.700')}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <VStack spacing={4} align="flex-start">
                    <MotionFlex
                      w={{ base: 12, md: 16 }}
                      h={{ base: 12, md: 16 }}
                      align="center"
                      justify="center"
                      rounded="full"
                      bg="linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon
                        as={feature.icon}
                        w={{ base: 6, md: 8 }}
                        h={{ base: 6, md: 8 }}
                        bgGradient="linear(to-r, #667eea, #764ba2)"
                        bgClip="text"
                      />
                    </MotionFlex>
                    <Text 
                      fontWeight="bold" 
                      fontSize={{ base: 'lg', md: 'xl' }}
                    >
                      {feature.title}
                    </Text>
                    <Text 
                      color="gray.500"
                      fontSize={{ base: 'sm', md: 'md' }}
                    >
                      {feature.text}
                    </Text>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
} 