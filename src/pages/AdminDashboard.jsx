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
  StatHelpText,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import { ChevronDownIcon, DownloadIcon, RepeatIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API_URL } from '../config/api';

const MotionBox = motion(Box);
const MotionContainer = motion(Container);

export default function AdminDashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedReviewOrder, setSelectedReviewOrder] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [reviewOrders, setReviewOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchReviewOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        API_ENDPOINTS.admin.getAllReviews,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setReviewOrders(response.data.reviewOrders || []);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch review orders';
      setError(errorMsg);
      toast({ title: 'Error', description: errorMsg, status: 'error' });
      console.error('Error fetching review orders:', err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchReviewOrders();
  }, [fetchReviewOrders]);

  const calculateStats = () => {
    const total = reviewOrders.length;
    const pending = reviewOrders.filter(r => r.status === 'requested' || r.status === 'assigned').length;
    const inProgress = reviewOrders.filter(r => r.status === 'in_progress').length;
    const completed = reviewOrders.filter(r => r.status === 'completed').length;
    const totalRevenue = completed * 30; // Assuming $30 per completed review

    // Average response time for completed reviews
    const completedReviewsWithDates = reviewOrders.filter(
      r => r.status === 'completed' && r.completedDate && r.submittedDate
    );
    const avgResponseTimeMs = completedReviewsWithDates.length > 0
      ? completedReviewsWithDates.reduce((acc, curr) => {
          const submitted = new Date(curr.submittedDate).getTime();
          const completed = new Date(curr.completedDate).getTime();
          return acc + (completed - submitted);
        }, 0) / completedReviewsWithDates.length
      : 0;
    const avgResponseTimeHours = Math.round(avgResponseTimeMs / (1000 * 60 * 60));

    return [
      { label: 'Total Reviews', value: total.toString() },
      { label: 'Pending Review', value: pending.toString() },
      { label: 'In Progress', value: inProgress.toString() },
      { label: 'Completed', value: completed.toString() },
      { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}` },
      { label: 'Avg. Response Time', value: `${avgResponseTimeHours}h` }
    ];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in-progress':
      case 'assigned':
        return 'yellow';
      case 'pending':
      case 'requested':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const handleStatusChange = async (reviewOrder, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (newStatus === 'completed') {
        setSelectedReviewOrder(reviewOrder);
        setFeedback(reviewOrder.reviewerFeedback || '');
        onOpen();
        return;
      }

      await axios.put(
        API_ENDPOINTS.admin.updateReview(reviewOrder.id),
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast({
        title: 'Review Completed',
        description: `Review status changed to ${newStatus}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchReviewOrders();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error("Status update error:", err);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedReviewOrder) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        API_ENDPOINTS.admin.updateReview(selectedReviewOrder.id),
        {
          status: 'completed',
          reviewerFeedback: feedback,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast({
        title: 'Review Completed',
        description: 'Status set to completed and feedback submitted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
      setFeedback('');
      setSelectedReviewOrder(null);
      fetchReviewOrders();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to submit feedback',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error("Feedback submission error:", err);
    }
  };

  const handleDownloadOriginal = async (reviewOrder) => {
    if (!reviewOrder?.resume?.id) return;
    const resumeId = reviewOrder.resume.id;
    const originalFileName = reviewOrder.resume.originalFileName || `resume-${resumeId}.pdf`;
    try {
      const response = await axios.get(
        API_ENDPOINTS.admin.downloadOriginal(resumeId),
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: 'Download failed',
        description: error.response?.data?.error || 'Error downloading the resume',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDownloadOptimized = async (reviewOrder) => {
    if (!reviewOrder?.resume?.id || !reviewOrder?.resume?.optimizedResume) {
        toast({ title: 'Not Available', description: 'Optimized resume not found for this review.', status: 'info' });
        return;
    }
    const resumeId = reviewOrder.resume.id;
    const originalFileName = reviewOrder.resume.originalFileName || `resume-${resumeId}.pdf`;
    
    try {
      const response = await axios.get(
        API_ENDPOINTS.admin.downloadOptimized(resumeId),
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `optimized-${originalFileName}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: 'Download failed',
        description: error.response?.data?.error || 'Error downloading the optimized resume',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUploadOptimized = async (reviewOrder, file) => {
    if (!reviewOrder?.resume?.id || !file) return;
    const resumeId = reviewOrder.resume.id;

    try {
      const formData = new FormData();
      formData.append('optimizedResume', file);

      const response = await axios.put(
        API_ENDPOINTS.admin.updateSubmission(resumeId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      toast({
        title: 'Optimized resume uploaded successfully.',
        description: 'Optimized resume uploaded successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchReviewOrders();
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.response?.data?.error || 'Error uploading the optimized resume',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error("Optimized upload error:", error);
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
              Admin Dashboard
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
              color="gray.500"
              maxW={{ base: "100%", md: "90%", lg: "80%" }}
              mx="auto"
              as={motion.p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Manage resume submissions and track performance metrics
            </Text>
          </Box>

          {/* Stats Grid */}
          <SimpleGrid
            columns={{ base: 2, md: 3, lg: 6 }}
            spacing={{ base: 4, md: 6 }}
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {calculateStats().map((stat, index) => (
              <MotionBox
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Box
                  p={{ base: 4, md: 6 }}
                  bg={useColorModeValue('white', 'gray.800')}
                  rounded="xl"
                  shadow="xl"
                  borderWidth="1px"
                  borderColor={useColorModeValue('gray.100', 'gray.700')}
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-4px)',
                    shadow: '2xl',
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
              </MotionBox>
            ))}
          </SimpleGrid>

          {/* Review Orders Table */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            bg={useColorModeValue('white', 'gray.800')}
            rounded="xl"
            shadow="xl"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.100', 'gray.700')}
            overflow="hidden"
          >
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg={useColorModeValue('gray.50', 'gray.900')}>
                  <Tr>
                    <Th fontSize={{ base: 'xs', md: 'sm' }}>User</Th>
                    <Th fontSize={{ base: 'xs', md: 'sm' }}>Resume File</Th>
                    <Th fontSize={{ base: 'xs', md: 'sm' }}>Review Requested</Th>
                    <Th fontSize={{ base: 'xs', md: 'sm' }}>Status</Th>
                    <Th fontSize={{ base: 'xs', md: 'sm' }}>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {reviewOrders.map((reviewOrder) => (
                    <Tr key={reviewOrder.id}>
                      <Td fontSize={{ base: 'sm', md: 'md' }}>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">{reviewOrder.user?.name || 'N/A'}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {reviewOrder.user?.email || 'N/A'}
                          </Text>
                        </VStack>
                      </Td>
                      <Td fontSize={{ base: 'sm', md: 'md' }}>{reviewOrder.resume?.originalFileName || 'N/A'}</Td>
                      <Td fontSize={{ base: 'sm', md: 'md' }}>
                        {new Date(reviewOrder.submittedDate).toLocaleDateString()}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={getStatusColor(reviewOrder.status)}
                          px={3}
                          py={1}
                          rounded="full"
                          fontSize={{ base: 'xs', md: 'sm' }}
                        >
                          {reviewOrder.status.replace('_', ' ')}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Menu>
                            <MenuButton
                              as={Button}
                              size={{ base: 'sm', md: 'md' }}
                              rightIcon={<ChevronDownIcon />}
                              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                              color="white"
                              _hover={{
                                bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
                              }}
                              _active={{
                                bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
                              }}
                            >
                              Update Status
                            </MenuButton>
                            <MenuList>
                              <MenuItem onClick={() => handleStatusChange(reviewOrder, 'requested')}>
                                Requested
                              </MenuItem>
                              <MenuItem onClick={() => handleStatusChange(reviewOrder, 'assigned')}>
                                Assigned
                              </MenuItem>
                              <MenuItem onClick={() => handleStatusChange(reviewOrder, 'in_progress')}>
                                In Progress
                              </MenuItem>
                              <MenuItem onClick={() => handleStatusChange(reviewOrder, 'completed')}>
                                Completed
                              </MenuItem>
                              <MenuItem onClick={() => handleStatusChange(reviewOrder, 'cancelled')}>
                                Cancelled
                              </MenuItem>
                            </MenuList>
                          </Menu>
                          <Button
                            size={{ base: 'sm', md: 'md' }}
                            leftIcon={<DownloadIcon />}
                            onClick={() => handleDownloadOriginal(reviewOrder)}
                            variant="outline"
                            borderColor="#667eea"
                            color="#667eea"
                            _hover={{
                              bg: "rgba(102,126,234,0.1)"
                            }}
                          >
                            Original
                          </Button>
                          <Button
                            size={{ base: 'sm', md: 'md' }}
                            leftIcon={<DownloadIcon />}
                            onClick={() => handleDownloadOptimized(reviewOrder)}
                            isDisabled={!reviewOrder.resume?.optimizedResume}
                            variant="outline"
                            borderColor="#764ba2"
                            color="#764ba2"
                            _hover={{
                              bg: "rgba(118,75,162,0.1)"
                            }}
                          >
                            Optimized
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </MotionBox>

          {/* Refresh Button */}
          <HStack justify="center" mt={{ base: 6, md: 8 }}>
            <Button
              leftIcon={<RepeatIcon />}
              onClick={fetchSubmissions}
              size={{ base: "md", md: "lg" }}
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              rounded="full"
              px={8}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
                bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
              }}
              transition="all 0.2s"
            >
              Refresh Data
            </Button>
          </HStack>
        </VStack>
      </Container>

      {/* Feedback Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bg={useColorModeValue('white', 'gray.800')}
          rounded="xl"
          mx={{ base: 4, md: 0 }}
        >
          <ModalHeader
            fontSize={{ base: 'xl', md: '2xl' }}
            bgGradient="linear(to-r, #667eea, #764ba2)"
            bgClip="text"
          >
            Add Feedback
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel fontSize={{ base: 'md', md: 'lg' }}>Upload Optimized Resume</FormLabel>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleUploadOptimized(selectedSubmission, e.target.files[0]);
                    }
                  }}
                  p={2}
                  border="2px dashed"
                  borderColor="gray.300"
                  _hover={{ borderColor: '#667eea' }}
                  h="auto"
                  py={4}
                  rounded="xl"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={{ base: 'md', md: 'lg' }}>Feedback</FormLabel>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your feedback here..."
                  size="lg"
                  rounded="xl"
                  borderWidth={2}
                  _hover={{ borderColor: '#667eea' }}
                  _focus={{ borderColor: '#764ba2', boxShadow: '0 0 0 1px #764ba2' }}
                  minH="150px"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={onClose}
              _hover={{
                bg: "rgba(102,126,234,0.1)"
              }}
            >
              Cancel
            </Button>
            <Button
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
                bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
              }}
              transition="all 0.2s"
              onClick={handleSubmitFeedback}
            >
              Submit Feedback
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 