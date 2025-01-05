import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

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

export default function PrivacyPolicy() {
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
              Privacy Policy
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
              Your privacy is important to us. Learn how we collect and use your information.
            </Text>
          </Box>

          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="show"
            w="full"
            maxW="100%"
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
            <VStack spacing={{ base: 8, md: 12 }} align="stretch">
              <Box>
                <Heading
                  fontSize={{ base: 'xl', md: '2xl' }}
                  mb={4}
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  bgClip="text"
                >
                  1. Information We Collect
                </Heading>
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  lineHeight="tall"
                  mb={4}
                >
                  We collect the following types of information:
                </Text>
                <UnorderedList
                  spacing={3}
                  pl={4}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  fontSize={{ base: 'md', md: 'lg' }}
                >
                  <ListItem>Personal information (name, email, contact details)</ListItem>
                  <ListItem>Resume content and professional information</ListItem>
                  <ListItem>Payment information</ListItem>
                  <ListItem>Usage data and analytics</ListItem>
                </UnorderedList>
              </Box>

              <Box>
                <Heading
                  fontSize={{ base: 'xl', md: '2xl' }}
                  mb={4}
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  bgClip="text"
                >
                  2. How We Use Your Information
                </Heading>
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  lineHeight="tall"
                  mb={4}
                >
                  We use your information to:
                </Text>
                <UnorderedList
                  spacing={3}
                  pl={4}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  fontSize={{ base: 'md', md: 'lg' }}
                >
                  <ListItem>Provide and improve our resume optimization services</ListItem>
                  <ListItem>Process payments and manage your account</ListItem>
                  <ListItem>Communicate with you about our services</ListItem>
                  <ListItem>Analyze and improve our platform</ListItem>
                </UnorderedList>
              </Box>

              <Box>
                <Heading
                  fontSize={{ base: 'xl', md: '2xl' }}
                  mb={4}
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  bgClip="text"
                >
                  3. Data Security
                </Heading>
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  lineHeight="tall"
                >
                  We implement appropriate security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. This includes encryption, secure servers, and regular security assessments.
                </Text>
              </Box>

              <Box>
                <Heading
                  fontSize={{ base: 'xl', md: '2xl' }}
                  mb={4}
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  bgClip="text"
                >
                  4. Information Sharing
                </Heading>
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  lineHeight="tall"
                >
                  We do not sell or rent your personal information to third parties. We may share your information with service providers who assist us in operating our platform and providing our services.
                </Text>
              </Box>

              <Box>
                <Heading
                  fontSize={{ base: 'xl', md: '2xl' }}
                  mb={4}
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  bgClip="text"
                >
                  5. Your Rights
                </Heading>
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  lineHeight="tall"
                  mb={4}
                >
                  You have the right to:
                </Text>
                <UnorderedList
                  spacing={3}
                  pl={4}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  fontSize={{ base: 'md', md: 'lg' }}
                >
                  <ListItem>Access your personal information</ListItem>
                  <ListItem>Request corrections to your data</ListItem>
                  <ListItem>Request deletion of your data</ListItem>
                  <ListItem>Opt-out of marketing communications</ListItem>
                </UnorderedList>
              </Box>

              <Box>
                <Heading
                  fontSize={{ base: 'xl', md: '2xl' }}
                  mb={4}
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  bgClip="text"
                >
                  6. Contact Us
                </Heading>
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  lineHeight="tall"
                >
                  If you have any questions about our Privacy Policy or how we handle your information, please contact us through our Contact Us page or email us at the address provided in our contact information.
                </Text>
              </Box>
            </VStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
} 