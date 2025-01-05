import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaUserTie, FaLightbulb, FaHandshake, FaChartLine } from 'react-icons/fa';

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

const features = [
  {
    title: 'Expert Team',
    description: 'Our team consists of experienced HR professionals, career coaches, and resume experts.',
    icon: FaUserTie,
  },
  {
    title: 'Innovation',
    description: 'We use cutting-edge AI technology to optimize resumes for modern job markets.',
    icon: FaLightbulb,
  },
  {
    title: 'Personalized Service',
    description: 'Each resume receives individual attention tailored to your specific career goals.',
    icon: FaHandshake,
  },
  {
    title: 'Proven Results',
    description: 'Our optimized resumes have helped thousands of professionals advance their careers.',
    icon: FaChartLine,
  },
];

export default function AboutUs() {
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
              About Us
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
              Empowering careers through optimized resumes and professional guidance
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
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color={useColorModeValue('gray.600', 'gray.300')}
                lineHeight="tall"
              >
                At Resume Optimizer, we believe that everyone deserves the opportunity to present their best professional self. Our platform combines human expertise with cutting-edge technology to help job seekers create compelling resumes that stand out in today's competitive job market.
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 8, md: 12 }}>
                {features.map((feature, index) => (
                  <MotionBox
                    key={feature.title}
                    variants={itemVariants}
                    p={6}
                    borderWidth={1}
                    borderRadius="lg"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    bg={useColorModeValue('white', 'gray.800')}
                    _hover={{
                      transform: 'translateY(-4px)',
                      shadow: 'lg',
                      borderColor: '#667eea',
                    }}
                    transition="all 0.2s"
                  >
                    <VStack align="start" spacing={4}>
                      <Icon
                        as={feature.icon}
                        w={8}
                        h={8}
                        color="#667eea"
                      />
                      <Heading
                        fontSize={{ base: 'xl', md: '2xl' }}
                        bgGradient="linear(to-r, #667eea, #764ba2)"
                        bgClip="text"
                      >
                        {feature.title}
                      </Heading>
                      <Text
                        color={useColorModeValue('gray.600', 'gray.300')}
                        fontSize={{ base: 'md', md: 'lg' }}
                      >
                        {feature.description}
                      </Text>
                    </VStack>
                  </MotionBox>
                ))}
              </SimpleGrid>

              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color={useColorModeValue('gray.600', 'gray.300')}
                lineHeight="tall"
              >
                Our mission is to bridge the gap between talented professionals and their dream careers. We understand that a resume is more than just a document – it's your personal brand, your story, and your key to new opportunities. That's why we're committed to providing comprehensive resume optimization services that help you showcase your unique value proposition.
              </Text>
            </VStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
} 