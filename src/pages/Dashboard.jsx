import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import { DownloadIcon, RepeatIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const MotionBox = motion(Box);
const MotionContainer = motion(Container);
const MotionButton = motion(Button);

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

export default function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const toast = useToast();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        API_ENDPOINTS.resumes.getUserSubmissions(user.id),
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSubmissions(response.data);
    } catch (err) {
      setError('Failed to fetch submissions');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in-progress':
        return 'yellow';
      case 'pending':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const calculateStats = () => {
    const total = submissions.length;
    const inProgress = submissions.filter(s => s.status === 'in-progress').length;
    const completed = submissions.filter(s => s.status === 'completed').length;
    const totalSpent = submissions.reduce((acc, curr) => acc + (curr.price || 0), 0);

    return [
      { label: 'Total Submissions', value: total.toString() },
      { label: 'In Progress', value: inProgress.toString() },
      { label: 'Completed', value: completed.toString() },
      { label: 'Amount Spent', value: `$${totalSpent.toFixed(2)}` }
    ];
  };

  const handleDownload = async (submission, type) => {
    try {
      const endpoint = type === 'original' 
        ? API_ENDPOINTS.resumes.downloadOriginal(submission.id)
        : API_ENDPOINTS.resumes.downloadOptimized(submission.id);
      
      const response = await axios.get(endpoint, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', type === 'original' 
        ? submission.originalFileName
        : `optimized-${submission.originalFileName}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: 'Download failed',
        description: error.response?.data?.error || `Error downloading the ${type} resume`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Center minH="100vh">
        <MotionBox
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Spinner
            size="xl"
            thickness="4px"
            color="#667eea"
            emptyColor={useColorModeValue('gray.200', 'gray.700')}
          />
        </MotionBox>
      </Center>
    );
  }

  return (
    <Box
      width="100vw"
      minH="100vh"
      overflowX="hidden"
      bg={useColorModeValue('gray.50', 'gray.900')}
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

      <Container 
        maxW="8xl" 
        px={{ base: 4, md: 8 }}
        py={{ base: 12, md: 20 }}
        position="relative"
      >
        <VStack
          spacing={{ base: 8, md: 12 }}
          align="stretch"
          as={MotionContainer}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Header Section */}
          <MotionBox variants={itemVariants}>
            <Heading
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', md: '5xl' }}
              lineHeight={{ base: "120%", md: "110%" }}
              bgGradient="linear(to-r, #667eea, #764ba2)"
              bgClip="text"
              mb={4}
            >
              Your Dashboard
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={useColorModeValue('gray.600', 'gray.300')}
            >
              Track and manage your resume optimization requests
            </Text>
          </MotionBox>

          {/* Stats Grid */}
          <SimpleGrid
            columns={{ base: 2, md: 4 }}
            spacing={{ base: 4, md: 6 }}
            as={MotionBox}
            variants={itemVariants}
          >
            {calculateStats().map((stat, index) => (
              <Box
                key={stat.label}
                bg={useColorModeValue('white', 'gray.800')}
                p={{ base: 6, md: 8 }}
                rounded="xl"
                shadow="base"
                border="1px"
                borderColor={useColorModeValue('gray.100', 'gray.700')}
                transition="all 0.2s"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'lg',
                }}
              >
                <Stat>
                  <StatLabel
                    fontSize={{ base: 'sm', md: 'md' }}
                    color={useColorModeValue('gray.600', 'gray.400')}
                  >
                    {stat.label}
                  </StatLabel>
                  <StatNumber
                    fontSize={{ base: 'xl', md: '2xl' }}
                    fontWeight="bold"
                    bgGradient="linear(to-r, #667eea, #764ba2)"
                    bgClip="text"
                  >
                    {stat.value}
                  </StatNumber>
                </Stat>
              </Box>
            ))}
          </SimpleGrid>

          {/* Submissions Table */}
          <MotionBox
            variants={itemVariants}
            bg={useColorModeValue('white', 'gray.800')}
            rounded="xl"
            shadow="base"
            border="1px"
            borderColor={useColorModeValue('gray.100', 'gray.700')}
            overflow="hidden"
          >
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg={useColorModeValue('gray.50', 'gray.900')}>
                  <Tr>
                    <Th>File Name</Th>
                    <Th>Status</Th>
                    <Th>Plan</Th>
                    <Th isNumeric>Price</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {submissions.map((submission) => (
                    <Tr key={submission.id}>
                      <Td fontSize={{ base: 'sm', md: 'md' }}>
                        {submission.originalFileName}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={getStatusColor(submission.status)}
                          px={3}
                          py={1}
                          rounded="full"
                          fontSize={{ base: 'xs', md: 'sm' }}
                        >
                          {submission.status}
                        </Badge>
                      </Td>
                      <Td fontSize={{ base: 'sm', md: 'md' }}>{submission.plan}</Td>
                      <Td isNumeric fontSize={{ base: 'sm', md: 'md' }}>${submission.price}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <MotionButton
                            size={{ base: 'sm', md: 'md' }}
                            leftIcon={<DownloadIcon />}
                            onClick={() => handleDownload(submission, 'original')}
                            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            color="white"
                            _hover={{
                              transform: 'translateY(-2px)',
                              boxShadow: 'lg',
                              bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
                            }}
                            transition="all 0.2s"
                          >
                            Original
                          </MotionButton>
                          {submission.optimizedResume && (
                            <MotionButton
                              size={{ base: 'sm', md: 'md' }}
                              leftIcon={<DownloadIcon />}
                              onClick={() => handleDownload(submission, 'optimized')}
                              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                              color="white"
                              _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg',
                                bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
                              }}
                              transition="all 0.2s"
                            >
                              Optimized
                            </MotionButton>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </MotionBox>

          {/* Refresh Button */}
          <MotionBox
            variants={itemVariants}
            display="flex"
            justifyContent="center"
            mt={6}
          >
            <MotionButton
              leftIcon={<RepeatIcon />}
              onClick={fetchSubmissions}
              size={{ base: "md", md: "lg" }}
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              px={8}
              rounded="full"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
                bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
              }}
              transition="all 0.2s"
            >
              Refresh Submissions
            </MotionButton>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}