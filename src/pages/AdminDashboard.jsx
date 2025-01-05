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
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API_URL } from '../config/api';

const MotionBox = motion(Box);
const MotionContainer = motion(Container);

export default function AdminDashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        API_ENDPOINTS.admin.getAllSubmissions,
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
    fetchSubmissions();
  }, []);

  const calculateStats = () => {
    const total = submissions.length;
    const pending = submissions.filter(s => s.status === 'pending').length;
    const inProgress = submissions.filter(s => s.status === 'in-progress').length;
    const completed = submissions.filter(s => s.status === 'completed').length;
    const totalRevenue = submissions.reduce((acc, curr) => acc + (curr.price || 0), 0);
    
    // Calculate average response time in hours
    const completedSubmissions = submissions.filter(s => s.status === 'completed' && s.completedAt);
    const avgResponseTime = completedSubmissions.length > 0
      ? completedSubmissions.reduce((acc, curr) => {
          const submittedDate = new Date(curr.submittedAt);
          const completedDate = new Date(curr.completedAt);
          return acc + (completedDate - submittedDate) / (1000 * 60 * 60);
        }, 0) / completedSubmissions.length
      : 0;

    return [
      { label: 'Total Submissions', value: total.toString() },
      { label: 'Pending Review', value: pending.toString() },
      { label: 'In Progress', value: inProgress.toString() },
      { label: 'Completed', value: completed.toString() },
      { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}` },
      { label: 'Avg. Response Time', value: `${Math.round(avgResponseTime)}h` }
    ];
  };

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

  const handleStatusChange = async (submission, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (newStatus === 'completed') {
        setSelectedSubmission(submission);
        onOpen();
        return;
      }

      await axios.put(
        API_ENDPOINTS.admin.updateSubmission(submission.id),
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast({
        title: 'Status Updated',
        description: `Status changed to ${newStatus}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchSubmissions();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        API_ENDPOINTS.admin.updateSubmission(selectedSubmission.id),
        {
          status: 'completed',
          feedback,
          completedAt: new Date().toISOString()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast({
        title: 'Feedback Submitted',
        description: 'Status updated and feedback submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
      setFeedback('');
      fetchSubmissions();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to submit feedback',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDownloadOriginal = async (submission) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/submissions/${submission.id}/download-original`,
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
      link.setAttribute('download', submission.originalFileName);
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

  const handleDownloadOptimized = async (submission) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/submissions/${submission.id}/download-optimized`,
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
      link.setAttribute('download', `optimized-${submission.originalFileName}`);
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

  const handleUploadOptimized = async (submission, file) => {
    try {
      const formData = new FormData();
      formData.append('optimizedResume', file);
      formData.append('status', 'completed');
      formData.append('feedback', feedback);

      const response = await axios.put(
        `${API_URL}/api/admin/submissions/${submission.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      toast({
        title: 'Upload successful',
        description: 'Optimized resume has been uploaded',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchSubmissions();
      onClose();
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.response?.data?.error || 'Error uploading the optimized resume',
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
                    <StatHelpText fontSize={{ base: 'xs', md: 'sm' }}>
                      Last 30 days
                    </StatHelpText>
                  </Stat>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>

          {/* Submissions Table */}
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
                    <Th fontSize={{ base: 'xs', md: 'sm' }}>File Name</Th>
                    <Th fontSize={{ base: 'xs', md: 'sm' }}>Submission Date</Th>
                    <Th fontSize={{ base: 'xs', md: 'sm' }}>Plan</Th>
                    <Th fontSize={{ base: 'xs', md: 'sm' }}>Status</Th>
                    <Th fontSize={{ base: 'xs', md: 'sm' }}>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {submissions.map((submission) => (
                    <Tr key={submission.id}>
                      <Td fontSize={{ base: 'sm', md: 'md' }}>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">{submission.user.name}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {submission.user.email}
                          </Text>
                        </VStack>
                      </Td>
                      <Td fontSize={{ base: 'sm', md: 'md' }}>{submission.originalFileName}</Td>
                      <Td fontSize={{ base: 'sm', md: 'md' }}>
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </Td>
                      <Td fontSize={{ base: 'sm', md: 'md' }}>{submission.plan}</Td>
                      <Td>
                        <Badge
                          colorScheme={getStatusColor(submission.status)}
                          px={3}
                          py={1}
                          rounded="full"
                          fontSize={{ base: 'xs', md: 'sm' }}
                        >
                          {submission.status.replace('-', ' ')}
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
                              <MenuItem onClick={() => handleStatusChange(submission, 'pending')}>
                                Pending
                              </MenuItem>
                              <MenuItem onClick={() => handleStatusChange(submission, 'in-progress')}>
                                In Progress
                              </MenuItem>
                              <MenuItem onClick={() => handleStatusChange(submission, 'completed')}>
                                Completed
                              </MenuItem>
                            </MenuList>
                          </Menu>
                          <Button
                            size={{ base: 'sm', md: 'md' }}
                            leftIcon={<DownloadIcon />}
                            onClick={() => handleDownloadOriginal(submission)}
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
                            onClick={() => handleDownloadOptimized(submission)}
                            isDisabled={!submission.optimizedResume}
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