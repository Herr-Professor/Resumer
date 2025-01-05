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

export default function TermsOfService() {
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
              Terms of Service
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
              Please read these terms carefully before using our services
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
                  1. Acceptance of Terms
                </Heading>
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  lineHeight="tall"
                >
                  By accessing and using Resume Optimizer's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </Text>
              </Box>

              <Box>
                <Heading
                  fontSize={{ base: 'xl', md: '2xl' }}
                  mb={4}
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  bgClip="text"
                >
                  2. Services Description
                </Heading>
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  lineHeight="tall"
                  mb={4}
                >
                  Resume Optimizer provides resume optimization and job application services. Our services include:
                </Text>
                <UnorderedList
                  spacing={3}
                  pl={4}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  fontSize={{ base: 'md', md: 'lg' }}
                >
                  <ListItem>Resume review and optimization</ListItem>
                  <ListItem>ATS compatibility enhancement</ListItem>
                  <ListItem>Professional formatting</ListItem>
                  <ListItem>Career coaching and guidance</ListItem>
                  <ListItem>Job application management</ListItem>
                </UnorderedList>
              </Box>

              <Box>
                <Heading
                  fontSize={{ base: 'xl', md: '2xl' }}
                  mb={4}
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  bgClip="text"
                >
                  3. User Responsibilities
                </Heading>
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  lineHeight="tall"
                  mb={4}
                >
                  Users of our services agree to:
                </Text>
                <UnorderedList
                  spacing={3}
                  pl={4}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  fontSize={{ base: 'md', md: 'lg' }}
                >
                  <ListItem>Provide accurate and truthful information</ListItem>
                  <ListItem>Maintain the confidentiality of their account</ListItem>
                  <ListItem>Not misuse or abuse our services</ListItem>
                  <ListItem>Comply with all applicable laws and regulations</ListItem>
                </UnorderedList>
              </Box>

              <Box>
                <Heading
                  fontSize={{ base: 'xl', md: '2xl' }}
                  mb={4}
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  bgClip="text"
                >
                  4. Payment Terms
                </Heading>
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  lineHeight="tall"
                >
                  Payment is required before services are rendered. All fees are non-refundable unless otherwise specified. We reserve the right to modify our pricing at any time.
                </Text>
              </Box>

              <Box>
                <Heading
                  fontSize={{ base: 'xl', md: '2xl' }}
                  mb={4}
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  bgClip="text"
                >
                  5. Intellectual Property
                </Heading>
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  lineHeight="tall"
                >
                  All content and materials provided through our services are protected by intellectual property rights. Users retain ownership of their original content but grant us a license to use it for service delivery.
                </Text>
              </Box>

              <Box>
                <Heading
                  fontSize={{ base: 'xl', md: '2xl' }}
                  mb={4}
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  bgClip="text"
                >
                  6. Limitation of Liability
                </Heading>
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color={useColorModeValue('gray.600', 'gray.300')}
                  lineHeight="tall"
                >
                  Resume Optimizer is not responsible for any outcomes related to the use of our services, including but not limited to job application results. We provide optimization services but cannot guarantee specific employment outcomes.
                </Text>
              </Box>
            </VStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
} 