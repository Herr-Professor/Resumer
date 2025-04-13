import { Box, Container, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, VStack, HStack, useColorModeValue, SimpleGrid, Stat, StatLabel, StatNumber, Menu, MenuButton, MenuList, MenuItem, Textarea, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure, FormControl, FormLabel, Input, Spinner, Center, useToast, List, ListItem } from '@chakra-ui/react';
import { ChevronDownIcon, DownloadIcon, RepeatIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const MotionBox = motion(Box);
const MotionContainer = motion(Container);

export default function AdminDashboard() {
  // State hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedReviewOrder, setSelectedReviewOrder] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [reviewOrders, setReviewOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const spinnerEmptyColor = useColorModeValue('gray.200', 'gray.700');

  // Data fetching
  const fetchReviewOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.admin.getAllReviews, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
  
  // Status change handler
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
        title: 'Status Updated',
        description: `Review status changed to ${newStatus.replace('_', ' ')}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchReviewOrders();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to update status',
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
        description: err.response?.data?.error || 'Failed to submit feedback',
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
      const token = localStorage.getItem('token');
      const response = await axios.get(
        API_ENDPOINTS.admin.downloadOriginal(resumeId),
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const errorDesc = error.response?.data?.details || error.response?.data?.error || 'Error downloading the resume';
      toast({
        title: 'Download Failed',
        description: errorDesc,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error("Download original error:", error);
    }
  };

  const handleDownloadOptimized = async (reviewOrder) => {
    if (!reviewOrder?.resume?.id || !reviewOrder?.resume?.optimizedResume) {
      toast({ title: 'Not Available', description: 'Optimized resume not found for this review.', status: 'info' });
      return;
    }
    const resumeId = reviewOrder.resume.id;
    const originalFileName = reviewOrder.resume.originalFileName || `resume-${resumeId}.pdf`;
    const downloadFileName = `optimized-${originalFileName}`;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        API_ENDPOINTS.admin.downloadOptimized(resumeId),
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', downloadFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const errorDesc = error.response?.data?.details || error.response?.data?.error || 'Error downloading the optimized resume';
      toast({
        title: 'Download Failed',
        description: errorDesc,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error("Download optimized error:", error);
    }
  };

  const handleUploadOptimizedFile = async (reviewOrder, file) => {
    if (!reviewOrder?.resume?.id || !file) return;
    const resumeId = reviewOrder.resume.id;

    const formData = new FormData();
    formData.append('optimizedResume', file);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        API_ENDPOINTS.admin.updateSubmission(resumeId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast({
        title: 'Upload Successful',
        description: 'Optimized resume file uploaded.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchReviewOrders();
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error.response?.data?.error || 'Error uploading the optimized resume',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error("Optimized upload error:", error);
    }
  };

  const calculateStats = () => {
    const total = reviewOrders.length;
    const pending = reviewOrders.filter(r => r.status === 'requested' || r.status === 'assigned').length;
    const inProgress = reviewOrders.filter(r => r.status === 'in_progress').length;
    const completed = reviewOrders.filter(r => r.status === 'completed').length;
    
    const estimatedRevenue = reviewOrders
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.price || 30), 0);

    const totalResumes = new Set(reviewOrders.map(r => r.resume?.id).filter(id => id)).size;

    return [
      { label: 'Total Resumes Reviewed', value: totalResumes.toString() },
      { label: 'Total Review Orders', value: total.toString() },
      { label: 'Pending Review', value: pending.toString() },
      { label: 'In Progress', value: inProgress.toString() },
      { label: 'Completed', value: completed.toString() },
      { label: 'Est. Revenue', value: `$${estimatedRevenue.toFixed(2)}` },
    ];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'assigned': return 'yellow';
      case 'requested': return 'purple';
      case 'cancelled': return 'red';
      default: return 'gray';
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
          <Spinner size="xl" thickness="4px" color="#667eea" emptyColor={spinnerEmptyColor} />
        </MotionBox>
      </Center>
    );
  }

  return (
    <Box width="100vw" minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={{ base: 12, md: 20 }}>
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

      <Container maxW={{ base: "100%", md: "90%", lg: "80%" }} px={{ base: 4, md: 8 }} position="relative">
        <VStack spacing={{ base: 6, md: 10 }} align="stretch">
          <Box textAlign="center">
            <Heading
              as={motion.h1}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              fontSize={{ base: '2xl', sm: '4xl', md: '5xl', lg: '6xl' }}
              bgGradient="linear(to-r, #667eea, #764ba2)"
              bgClip="text"
            >
              Admin Dashboard
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg', lg: 'xl' }} color="gray.500">
              Manage resume submissions and track performance metrics
            </Text>
          </Box>

          {error ? (
            <Center py={20} flexDirection="column">
              <Text color="red.500" mb={4}>Error loading review orders:</Text>
              <Text color="red.400" mb={4}>{error}</Text>
              <Button
                leftIcon={<RepeatIcon />}
                onClick={fetchReviewOrders}
                colorScheme="red"
              >
                Retry
              </Button>
            </Center>
          ) : (
            <>
              <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={{ base: 4, md: 6 }}>
                {calculateStats().map((stat, index) => (
                  <MotionBox
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Box p={{ base: 4, md: 6 }} bg={bgColor} rounded="xl" shadow="xl" borderWidth="1px" borderColor={borderColor}>
                      <Stat>
                        <StatLabel fontSize={{ base: 'sm', md: 'md' }} color={textColor}>
                          {stat.label}
                        </StatLabel>
                        <StatNumber fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" bgGradient="linear(to-r, #667eea, #764ba2)" bgClip="text">
                          {stat.value}
                        </StatNumber>
                      </Stat>
                    </Box>
                  </MotionBox>
                ))}
              </SimpleGrid>

              <MotionBox 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }} 
                bg={bgColor} 
                rounded="xl" 
                shadow="xl" 
                borderWidth="1px" 
                borderColor={borderColor}
              >
                <Box overflowX="auto">
                  <Table variant="simple" size="md">
                    <Thead bg={useColorModeValue('gray.50', 'gray.900')}>
                      <Tr>
                        <Th px={{ base: 2, md: 4 }} py={3}>User</Th>
                        <Th px={{ base: 2, md: 4 }} py={3}>Resume File</Th>
                        <Th px={{ base: 2, md: 4 }} py={3}>Review Requested</Th>
                        <Th px={{ base: 2, md: 4 }} py={3} isNumeric>ATS Score</Th>
                        <Th px={{ base: 2, md: 4 }} py={3} isNumeric>Opt. Score</Th>
                        <Th px={{ base: 2, md: 4 }} py={3}>Status</Th>
                        <Th px={{ base: 2, md: 4 }} py={3}>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {reviewOrders.length === 0 ? (
                        <Tr>
                          <Td colSpan={7} textAlign="center" py={10}>
                            <Text fontSize="lg" color="gray.500">No review orders found</Text>
                          </Td>
                        </Tr>
                      ) : (
                        reviewOrders.map((reviewOrder) => (
                          <Tr key={reviewOrder.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                            <Td px={{ base: 2, md: 4 }} py={3}>
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="medium" fontSize={{ base: 'sm', md: 'md' }}>
                                  {reviewOrder.user?.name || 'N/A'}
                                </Text>
                                <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500" noOfLines={1}>
                                  {reviewOrder.user?.email || 'N/A'}
                                </Text>
                              </VStack>
                            </Td>
                            <Td px={{ base: 2, md: 4 }} py={3} maxW={{ base: '150px', md: '200px' }}>
                              <Text 
                                fontSize={{ base: 'sm', md: 'md' }} 
                                isTruncated 
                                title={reviewOrder.resume?.originalFileName || 'N/A'}
                              >
                                {reviewOrder.resume?.originalFileName || 'N/A'}
                              </Text>
                            </Td>
                            <Td px={{ base: 2, md: 4 }} py={3}>
                              <Text fontSize={{ base: 'sm', md: 'md' }}>
                                {new Date(reviewOrder.submittedDate).toLocaleDateString()}
                              </Text>
                            </Td>
                            <Td px={{ base: 2, md: 4 }} py={3} isNumeric>
                              <Text fontSize={{ base: 'sm', md: 'md' }}>
                                {reviewOrder.resume?.atsScore ?? 'N/A'}
                              </Text>
                            </Td>
                            <Td px={{ base: 2, md: 4 }} py={3} isNumeric>
                              <Text fontSize={{ base: 'sm', md: 'md' }}>
                                {reviewOrder.resume?.optimizationScore ?? 'N/A'}
                              </Text>
                            </Td>
                            <Td px={{ base: 2, md: 4 }} py={3}>
                              <Badge 
                                colorScheme={getStatusColor(reviewOrder.status)} 
                                px={3} 
                                py={1} 
                                rounded="full" 
                                textTransform="capitalize"
                                fontSize={{ base: 'xs', md: 'sm' }}
                              >
                                {reviewOrder.status.replace('_', ' ')}
                              </Badge>
                            </Td>
                            <Td px={{ base: 2, md: 4 }} py={3}>
                              <HStack 
                                spacing={{ base: 1, md: 2 }} 
                                flexWrap="wrap" 
                                justify={{ base: 'center', md: 'flex-start' }}
                              >
                                <Menu>
                                  <MenuButton
                                    as={Button}
                                    size={{ base: 'xs', md: 'sm' }}
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
                                    Status
                                  </MenuButton>
                                  <MenuList minWidth="140px">
                                    <MenuItem fontSize={{ base: 'sm', md: 'md' }} onClick={() => handleStatusChange(reviewOrder, 'requested')}>
                                      Requested
                                    </MenuItem>
                                    <MenuItem fontSize={{ base: 'sm', md: 'md' }} onClick={() => handleStatusChange(reviewOrder, 'assigned')}>
                                      Assigned
                                    </MenuItem>
                                    <MenuItem fontSize={{ base: 'sm', md: 'md' }} onClick={() => handleStatusChange(reviewOrder, 'in_progress')}>
                                      In Progress
                                    </MenuItem>
                                    <MenuItem fontSize={{ base: 'sm', md: 'md' }} onClick={() => handleStatusChange(reviewOrder, 'completed')}>
                                      Completed
                                    </MenuItem>
                                    <MenuItem fontSize={{ base: 'sm', md: 'md' }} onClick={() => handleStatusChange(reviewOrder, 'cancelled')}>
                                      Cancelled
                                    </MenuItem>
                                  </MenuList>
                                </Menu>
                                <Button
                                  size={{ base: 'xs', md: 'sm' }}
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
                                  size={{ base: 'xs', md: 'sm' }}
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
                                <Button
                                  size={{ base: 'xs', md: 'sm' }}
                                  onClick={() => setSelectedResume(reviewOrder.resume)}
                                  variant="outline"
                                  colorScheme="gray"
                                  px={{ base: 2, md: 3 }}
                                >
                                  Details
                                </Button>
                              </HStack>
                            </Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </MotionBox>

              <HStack justify="center" mt={{ base: 6, md: 8 }}>
                <Button
                  leftIcon={<RepeatIcon />}
                  onClick={fetchReviewOrders}
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  _hover={{ bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)" }}
                >
                  Refresh Data
                </Button>
              </HStack>
            </>
          )}
        </VStack>
      </Container>

      <Modal isOpen={!!selectedResume} onClose={() => setSelectedResume(null)} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Resume Details & Analysis</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedResume ? (
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading size="sm" mb={2}>AI Analysis Scores</Heading>
                  <SimpleGrid columns={2} spacing={4}>
                    <Stat>
                      <StatLabel>ATS Score</StatLabel>
                      <StatNumber>{selectedResume.atsScore ?? 'N/A'}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Optimization Score</StatLabel>
                      <StatNumber>{selectedResume.optimizationScore ?? 'N/A'}</StatNumber>
                    </Stat>
                  </SimpleGrid>
                </Box>

                {selectedResume.keywordAnalysis && (
                  <Box>
                    <Heading size="sm" mb={2}>Keyword Analysis</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text fontWeight="bold" mb={1}>Matched Keywords:</Text>
                        {selectedResume.keywordAnalysis.matchedKeywords?.length > 0 ? (
                          <List spacing={1}>
                            {selectedResume.keywordAnalysis.matchedKeywords.map((kw, i) => (
                              <ListItem key={`match-${i}`} fontSize="sm">{kw}</ListItem>
                            ))}
                          </List>
                        ) : <Text fontSize="sm" color="gray.500">None found</Text>}
                      </Box>
                      <Box>
                        <Text fontWeight="bold" mb={1}>Missing Keywords:</Text>
                        {selectedResume.keywordAnalysis.missingKeywords?.length > 0 ? (
                          <List spacing={1}>
                            {selectedResume.keywordAnalysis.missingKeywords.map((kw, i) => (
                              <ListItem key={`miss-${i}`} fontSize="sm">{kw}</ListItem>
                            ))}
                          </List>
                        ) : <Text fontSize="sm" color="gray.500">None found</Text>}
                      </Box>
                    </SimpleGrid>
                  </Box>
                )}

                {selectedResume.feedback && Array.isArray(selectedResume.feedback) && selectedResume.feedback.length > 0 && (
                  <Box>
                    <Heading size="sm" mb={2}>AI Feedback/Suggestions</Heading>
                    <List spacing={1}>
                      {selectedResume.feedback.map((item, i) => (
                        <ListItem key={`feedback-${i}`} fontSize="sm">
                          {typeof item === 'string' ? item : item.message}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Box>
                  <Heading size="sm" mb={2}>Job Description Provided</Heading>
                  <Box
                    maxH="200px"
                    overflowY="auto"
                    border="1px solid"
                    borderColor={borderColor}
                    p={3}
                    rounded="md"
                    bg={useColorModeValue('gray.50', 'gray.700')}
                  >
                    <Text whiteSpace="pre-wrap" fontSize="sm">
                      {selectedResume.jobDescription || 'No job description provided.'}
                    </Text>
                  </Box>
                </Box>

                {selectedResume.editedText && (
                  <Box>
                    <Heading size="sm" mb={2}>User Edited Text (if any)</Heading>
                    <Box maxH="200px" overflowY="auto" border="1px solid" borderColor={borderColor} p={3} rounded="md" bg={useColorModeValue('gray.50', 'gray.700')}>
                      <Text whiteSpace="pre-wrap" fontSize="sm">
                        {selectedResume.editedText}
                      </Text>
                    </Box>
                  </Box>
                )}
              </VStack>
            ) : (
              <Text>No resume details available.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setSelectedResume(null)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bg={bgColor}
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
                <FormLabel fontSize={{ base: 'md', md: 'lg' }}>Upload Optimized Resume (Optional)</FormLabel>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files[0] && selectedReviewOrder) {
                      handleUploadOptimizedFile(selectedReviewOrder, e.target.files[0]);
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
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Uploading will replace any existing optimized file for this resume.
                </Text>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize={{ base: 'md', md: 'lg' }}>Reviewer Feedback</FormLabel>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your detailed feedback for the user here..."
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
              isDisabled={!feedback.trim()}
            >
              Complete Review & Submit Feedback
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
