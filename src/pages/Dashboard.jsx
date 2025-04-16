import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, VStack, HStack, useColorModeValue, SimpleGrid, Stat, StatLabel, StatNumber, Spinner, Center, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Tabs, TabList, TabPanels, Tab, TabPanel, List, ListItem, ListIcon, Textarea, FormControl, FormLabel, Alert, AlertIcon,
} from '@chakra-ui/react';
import { DownloadIcon, RepeatIcon, ViewIcon, ChatIcon, EditIcon, CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';

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

// Load Stripe (replace with your actual public key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_YOUR_PUBLIC_KEY');

export default function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [reviewOrders, setReviewOrders] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, refreshUserProfile } = useAuth();
  const toast = useToast();
  const { isOpen: isFeedbackModalOpen, onOpen: onFeedbackModalOpen, onClose: onFeedbackModalClose } = useDisclosure();
  const { isOpen: isReviewModalOpen, onOpen: onReviewModalOpen, onClose: onReviewModalClose } = useDisclosure();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [isJdLoading, setIsJdLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const navigate = useNavigate();

  // Custom close handler for the feedback modal to refetch data
  const handleFeedbackModalClose = () => {
    onFeedbackModalClose();
    // Refetch data when modal closes to ensure review status is updated
    fetchData(); 
  };

  // Check if the selected submission is currently under review
  const isUnderReview = selectedSubmission && (
    reviewOrders.some(r => 
      r.resumeId === selectedSubmission.id && 
      !['completed', 'cancelled'].includes(r.status) // Add other terminal statuses if needed
    ) || 
    selectedSubmission.status === 'pending_review'
  );

  // Move all useColorModeValue hooks to the top
  const spinnerEmptyColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.100', 'gray.700');
  const statLabelColor = useColorModeValue('gray.500', 'gray.400');
  const statNumberColor = useColorModeValue('gray.800', 'white');
  const feedbackBgColor = useColorModeValue('gray.100', 'gray.700');

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }
    
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [submissionsRes, reviewsRes, statsRes] = await Promise.all([
        axios.get(API_ENDPOINTS.resumes.getMySubmissions, { headers }),
        axios.get(API_ENDPOINTS.resumes.getUserReviews, { headers }),
        axios.get(API_ENDPOINTS.resumes.getUserStats, { headers })
      ]);
      
      setSubmissions(submissionsRes.data);
      setReviewOrders(reviewsRes.data);
      setUserStats(statsRes.data);

    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
      toast({ 
        title: 'Error', 
        description: err.response?.data?.error || 'Could not load dashboard data.', 
        status: 'error' 
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchData();
    
    // Check for payment success
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    
    if (success && sessionId) {
      const verifyPayment = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            API_ENDPOINTS.payments.checkPayment(sessionId),
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (response.data.status === 'paid') {
            // Determine service type from metadata
            const serviceType = response.data.metadata?.serviceType;
            let toastDesc = 'Your purchase was successful.';

            if (serviceType === 'review') {
              toastDesc = 'Your review request has been submitted. It may take a moment to appear in your dashboard.';
            } else if (serviceType === 'ppu_ats' || serviceType === 'ppu_optimization') {
              toastDesc = 'Your credits have been added to your account.';
            } else if (serviceType === 'subscription') {
              toastDesc = 'Your subscription is now active.';
            }
            
            toast({
              title: 'Payment Successful',
              description: toastDesc,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });

            // --- Optimistic UI Updates --- 
            if (serviceType === 'review') {
              const resumeId = parseInt(response.data.metadata?.resumeId);
              if (resumeId) {
                // Optimistically add to reviewOrders
                setReviewOrders(prevOrders => [
                  ...prevOrders,
                  // Add a placeholder - ensure structure matches fetched data somewhat
                  { 
                    resumeId: resumeId, 
                    status: 'requested', 
                    submittedDate: new Date().toISOString(), // Use current time as placeholder
                    // Add other fields expected by the UI if necessary, e.g., resume: null 
                  }
                ]);
                // Optimistically update submission status
                setSubmissions(prevSubs => 
                  prevSubs.map(sub => 
                    sub.id === resumeId ? { ...sub, status: 'pending_review' } : sub
                  )
                );
              }
            }
            // --- End Optimistic UI Updates ---

            // Refresh user profile to get updated credits/status
            await refreshUserProfile(); 
            
            // For review orders, we need to wait a bit for the webhook to process
            // before fetching data to ensure the review order is created
            if (serviceType === 'review') {
              // Wait 3 seconds before fetching data to give the webhook time to process
              setTimeout(() => {
                fetchData();
              }, 3000);
            } else {
              fetchData(); // Refresh dashboard data immediately for other service types
            }
          }
          
          // Clean up URL parameters
          window.history.replaceState({}, document.title, '/dashboard');
        } catch (error) {
          console.error('Error verifying payment:', error);
          toast({
            title: 'Payment Verification Failed',
            description: 'Please contact support if your credits were not added.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };
      
      verifyPayment();
    }
  }, [fetchData, toast, refreshUserProfile]);

  const viewFeedback = (submission) => {
    setSelectedSubmission(submission);
    setJobDescriptionText(submission.jobDescription || '');
    onFeedbackModalOpen();
  };
  
  const viewReview = (resumeId) => {
     const review = reviewOrders.find(r => r.resumeId === resumeId);
     if (review) {
        setSelectedReview(review);
        onReviewModalOpen();
     } else {
        console.warn("Could not find matching review order for resume:", resumeId);
     }
  };

  const handleUpdateJobDescription = async () => {
    if (!selectedSubmission) return;
    setIsJdLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        API_ENDPOINTS.resumes.addJobDescription(selectedSubmission.id),
        { jobDescription: jobDescriptionText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: 'Success', description: 'Job description updated.', status: 'success' });
      
      // Update the selected submission state directly to enable the button
      setSelectedSubmission(prev => prev ? { ...prev, jobDescription: jobDescriptionText } : null);
      
      fetchData(); // Also refresh the main list
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update job description.', status: 'error' });
      console.error("Error updating JD:", error);
    } finally {
      setIsJdLoading(false);
    }
  };
  
  const handlePayment = async (serviceType, resumeId = null) => {
      setIsActionLoading(true);
      const token = localStorage.getItem('token');
      try {
          const payload = { serviceType, userId: user.id };
          if (resumeId) {
              payload.resumeId = resumeId;
          }
          const response = await axios.post(
              API_ENDPOINTS.payments.createCheckout, 
              payload,
              { headers: { Authorization: `Bearer ${token}` } }
          );
          
          // Use the URL directly from the response
          window.location.href = response.data.url;
          
          // Show success message before redirect
          toast({ 
            title: 'Payment Initiated', 
            description: 'Redirecting to payment page...', 
            status: 'info',
            duration: 3000,
            isClosable: true
          });
      } catch (error) {
          toast({ 
            title: 'Payment Error', 
            description: error.message || 'Could not initiate payment.', 
            status: 'error',
            duration: 5000,
            isClosable: true
          });
          console.error("Payment initiation error:", error);
      } finally {
          setIsActionLoading(false);
      }
  };

  const handleTriggerAnalysis = async (actionType, resumeId) => {
     setIsActionLoading(true);
     const token = localStorage.getItem('token');
     const endpoint = actionType === 'detailed_ats' 
         ? API_ENDPOINTS.resumes.detailedAtsReport(resumeId)
         : API_ENDPOINTS.resumes.jobOptimization(resumeId);
         
     try {
        await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
        toast({ title: 'Analysis Started', description: `Your ${actionType === 'detailed_ats' ? 'Detailed ATS Report' : 'Job Optimization'} is being generated.`, status: 'info' });
        
        // Refresh user profile to update credits
        await refreshUserProfile(); 
        
        fetchData(); // Refresh submissions/reviews
        onFeedbackModalClose();
        
     } catch (error) {
       const errorMsg = error.response?.data?.error || 'Failed to start analysis.';
       toast({ title: 'Error', description: errorMsg, status: 'error' });
       console.error(`Error triggering ${actionType}:`, error);
     } finally {
        setIsActionLoading(false);
     }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'review_complete':
        return 'green';
      case 'pending_review':
      case 'in_progress':
        return 'yellow';
      case 'requested':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const calculateStats = () => {
    // Default stats array for fallback scenarios
    const defaultStats = [
      { label: 'Resumes Uploaded', value: '0' },
      { label: 'Analyses Completed', value: '0' },
      { label: 'Pending Reviews', value: '0' },
      { label: 'Completed Reviews', value: '0' },
      { label: 'ATS Credits', value: user?.ppuAtsCredits?.toString() || '0' },
      { label: 'Opt. Credits', value: user?.ppuOptimizationCredits?.toString() || '0' },
    ];

    // Check if userStats is available and is an object
    if (!userStats || typeof userStats !== 'object') {
      // Keep this warning, it indicates the API fetch failed or returned unexpected data
      console.warn("API userStats unavailable or not an object, returning default stats.", userStats);
      // Attempt to show credits from the user context as a fallback if userStats failed
      return [
        { label: 'Resumes Uploaded', value: 'N/A' },
        { label: 'Analyses Completed', value: 'N/A' },
        { label: 'Pending Reviews', value: 'N/A' },
        { label: 'Completed Reviews', value: 'N/A' },
        { label: 'ATS Credits', value: user?.ppuAtsCredits?.toString() ?? '0' },
        { label: 'Opt. Credits', value: user?.ppuOptimizationCredits?.toString() ?? '0' },
      ];
    }

    // Log the structure of userStats for debugging ONLY during development
    if (process.env.NODE_ENV === 'development') {
        console.log("Received userStats for calculation:", JSON.stringify(userStats, null, 2));
    }


    // Safely determine the value for 'Analyses Completed' from the object
    let analysesCompletedValue = '0';
    if (userStats.analysesCompleted &&
        typeof userStats.analysesCompleted === 'object' &&
        // Use optional chaining ?. just in case 'total' is missing
        userStats.analysesCompleted.total !== undefined) {
      analysesCompletedValue = userStats.analysesCompleted.total.toString();
    } else {
      // Log if the structure is not as expected
      console.warn("userStats.analysesCompleted is not in the expected format:", userStats.analysesCompleted);
    }

    // Construct the stats array using API data directly, with nullish coalescing for safety
    return [
      { label: 'Resumes Uploaded', value: userStats.resumesUploaded?.toString() ?? '0' },
      { label: 'Analyses Completed', value: analysesCompletedValue },
      // --- Use the values directly from the userStats API response ---
      { label: 'Pending Reviews', value: userStats.pendingReviews?.toString() ?? '0' },
      { label: 'Completed Reviews', value: userStats.completedReviews?.toString() ?? '0' },
      // --- Credits ---
      { label: 'ATS Credits', value: userStats.atsCredits?.toString() ?? '0' },
      { label: 'Opt. Credits', value: userStats.optimizationCredits?.toString() ?? '0' },
    ];
  };

  const handleDownload = async (submission, type) => {
    // Construct the backend endpoint URL
    const endpoint = type === 'original' 
      ? API_ENDPOINTS.resumes.downloadOriginal(submission.id) 
      : API_ENDPOINTS.resumes.downloadOptimized(submission.id);

    // Get the token
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: 'Authentication Error',
        description: 'Cannot download file. Please log in again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return; // Stop if no token
    }

    // --- OPTION 1: Direct Navigation (Recommended) ---
    // Construct the full URL with the token (using a query parameter is one way,
    // but less secure if URLs are logged. A backend session/cookie might be better long-term,
    // but for JWT, sending it to the redirect endpoint which then validates is standard).
    // Since the backend endpoint /api/resumes/.../:id/download-original requires the
    // Authorization header, direct navigation won't work easily with JWT Bearer tokens,
    // as we can't set headers for window.location.href.

    // --- OPTION 2: Fetch and Simulate Click (Keeps Auth Header logic) ---
    // We need to fetch but NOT expect a blob, just check the response status
    // If the backend redirect (302) works, the browser handles the download.
    // However, fetch API by default doesn't expose redirect responses easily (opaque redirect).
    // We can try initiating the download via a form or hidden iframe, but the 
    // simplest reliable way is often to fetch the blob URL manually if needed.

    // --- OPTION 3: Get Blob URL First (If direct redirect fails due to auth header) ---
    // If the backend could provide the signed Blob URL directly instead of redirecting,
    // this would be simpler. But assuming the current redirect logic:

    // Let's revert to the original Axios logic BUT handle the redirect issue.
    // The core issue might be that Axios + responseType:'blob' doesn't follow redirects well.
    // Try *without* responseType: 'blob' initially just to see if the redirect happens.
    // We can then try fetching the blob URL manually if needed.

    // --- Let's try simulating a link click which *should* include credentials if browser handles correctly --- 
    // This relies on the browser sending credentials (cookies) if your backend uses them.
    // For Bearer token, this won't work directly.
    
    // --- FINAL ATTEMPT: Use fetch with manual redirect handling (More Complex) --- 
    // This is getting complicated. Let's simplify.

    // --- Simplest Approach: Just open the authenticated endpoint URL in a new tab --- 
    // The browser should handle the auth (if cookie-based) or the backend validates the token
    // and issues the redirect which the browser follows.
    try {
        const fullUrl = `${import.meta.env.VITE_API_BASE_URL}${endpoint}`;
        
        // We need to trigger a request that *includes* the Authorization header.
        // Setting window.location won't do that.
        // Fetch API can, but handling the redirect + download is tricky.

        // Let's re-attempt the original Axios logic, maybe the 404 was the real issue before.
        // If this still fails, it points back to the backend 404 problem.
        const response = await axios.get(endpoint, {
            responseType: 'blob', // Keep this for now, assuming the backend 404 might be fixed
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // If we reach here, the backend MUST have sent a 200 OK with a blob,
          // which means the redirect logic was changed or bypassed.
          // Or, Axios somehow handled the 302 + redirect + final blob fetch.
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', type === 'original' 
            ? submission.originalFileName 
            : `optimized-${submission.originalFileName}`); 
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url); // Clean up object URL

    } catch (error) {
        console.error("Download error:", error);
        // Log the detailed error object
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
             // Attempt to read error message if response was blob but contained JSON error
            if (error.response.data instanceof Blob && error.response.data.type.includes('json')) {
                try {
                    const errorJson = JSON.parse(await error.response.data.text());
                     toast({
                        title: 'Download failed',
                        description: errorJson.error || errorJson.message || `Server error ${error.response.status}`,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                } catch (parseError) {
                     toast({
                        title: 'Download failed',
                        description: `Error downloading the ${type} resume. Status: ${error.response.status}`,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            } else {
                 toast({
                    title: 'Download failed',
                    description: error.response.data?.error || error.response.data?.message || `Server error ${error.response.status}`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request:', error.request);
            toast({
                title: 'Download failed',
                description: 'No response received from server.',
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
            toast({
                title: 'Download failed',
                description: error.message || `Error downloading the ${type} resume`,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
        }
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
            emptyColor={spinnerEmptyColor}
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
      bg={bgColor}
      position="relative"
    >
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
              color={textColor}
            >
              Track and manage your resume optimization requests
            </Text>
          </MotionBox>

          <MotionBox variants={itemVariants} w="full" textAlign="right">
             <Text fontSize="sm" color="gray.500">
  		Account Status: <Badge colorScheme={user?.subscriptionStatus === 'premium' ? 'green' : 'gray'}>{user?.subscriptionStatus || 'free'}</Badge> | 
  		ATS Credits: {user?.ppuAtsCredits || 0} | 
  		Optimization Credits: {user?.ppuOptimizationCredits || 0}
	     </Text>
          </MotionBox>

          {/* Conditionally render the stats grid only when userStats is available */}
          {userStats && (
            <SimpleGrid
              columns={{ base: 2, md: 4 }}
              spacing={{ base: 4, md: 6 }}
              as={MotionBox}
              variants={itemVariants}
            >
              {calculateStats().map((stat, index) => (
                <MotionBox variants={itemVariants} key={index}>
                  <Stat
                    p={{ base: 3, md: 5 }}
                    shadow='md'
                    borderWidth='1px'
                    borderColor={borderColor}
                    rounded='lg'
                    bg={cardBgColor}
                    transition="all 0.2s"
                    _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                  >
                    <StatLabel 
                      fontWeight={'medium'} 
                      isTruncated
                      color={statLabelColor}
                      fontSize={{base: 'sm', md: 'md'}}
                    >
                        {stat.label}
                    </StatLabel>
                    <StatNumber 
                      fontSize={{base: 'xl', md: '2xl'}} 
                      fontWeight={'semibold'}
                      color={statNumberColor}
                    >
                        {stat.value}
                    </StatNumber>
                  </Stat>
                </MotionBox>
              ))}
            </SimpleGrid>
          )}

          <MotionBox
            variants={itemVariants}
            bg={cardBgColor}
            rounded="xl"
            shadow="base"
            border="1px"
            borderColor={cardBorderColor}
            overflow="hidden"
          >
            <Box overflowX="auto">
              <Table variant="simple" size={{ base: "sm", md: "md" }}>
                <Thead>
                  <Tr>
                    <Th>File Name</Th>
                    <Th>Submitted</Th>
                    <Th>Status</Th>
                    <Th>ATS Score</Th>
                    <Th>Opt. Score</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {submissions.map((submission) => (
                    <Tr key={submission.id}>
                      <Td>{submission.originalFileName}</Td>
                      <Td>{new Date(submission.submittedAt).toLocaleDateString()}</Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(submission.status)}>
                          {reviewOrders.some(r => r.resumeId === submission.id) 
                            ? `Review: ${reviewOrders.find(r => r.resumeId === submission.id).status}`
                            : submission.status}
                        </Badge>
                      </Td>
                      <Td>{submission.atsScore ?? 'N/A'}</Td>
                      <Td>{submission.optimizationScore ?? 'N/A'}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <MotionButton size="xs" leftIcon={<DownloadIcon />} onClick={() => handleDownload(submission, 'original')} whileHover={{ scale: 1.1 }}>Original</MotionButton>
                          {submission.optimizedResume && <MotionButton size="xs" leftIcon={<DownloadIcon />} colorScheme="green" onClick={() => handleDownload(submission, 'optimized')} whileHover={{ scale: 1.1 }}>Optimized</MotionButton>}
                          <MotionButton size="xs" leftIcon={<ViewIcon />} colorScheme="blue" onClick={() => viewFeedback(submission)} whileHover={{ scale: 1.1 }}>Details / Actions</MotionButton>
                          {reviewOrders.some(r => r.resumeId === submission.id && r.status !== 'requested') && (
                                <MotionButton 
                                   size="xs" 
                                   leftIcon={<ChatIcon />} 
                                   colorScheme={reviewOrders.find(r => r.resumeId === submission.id)?.status === 'completed' ? 'purple' : 'orange'}
                                   onClick={() => viewReview(submission.id)} 
                                   whileHover={{ scale: 1.1 }}>
                                   Review Status
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

          <MotionBox variants={itemVariants} display="flex" justifyContent="center" gap={4} pt={4}>
              <Button 
                colorScheme="teal" 
                onClick={() => handlePayment('ppu_ats')}
                isLoading={isActionLoading}
                loadingText="Processing..."
              >
                Buy ATS Credit ($5)
              </Button>
              <Button 
                colorScheme="orange" 
                onClick={() => handlePayment('ppu_optimization')}
                isLoading={isActionLoading}
                loadingText="Processing..."
              >
                Buy Optimization Credit ($10)
              </Button>
          </MotionBox>
        </VStack>
      </Container>

      <Modal isOpen={isFeedbackModalOpen} onClose={handleFeedbackModalClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Resume Details & Actions: {selectedSubmission?.originalFileName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedSubmission && (
              <Tabs isFitted variant='enclosed'>
                <TabList mb='1em'>
                  <Tab>Feedback</Tab>
                  <Tab>Job Description</Tab>
                  <Tab>Actions</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Heading size="sm" mb={2}>Analysis Results</Heading>
                    <Text><strong>Status:</strong> <Badge colorScheme={getStatusColor(selectedSubmission.status)}>{selectedSubmission.status}</Badge></Text>
                    <Text><strong>ATS Score:</strong> {selectedSubmission.atsScore ?? 'N/A'}</Text>
                    <Text><strong>Optimization Score:</strong> {selectedSubmission.optimizationScore ?? 'N/A'}</Text>
                    {selectedSubmission.ppuOptimizationClicksRemaining !== null && (
                        <Text><strong>PPU Clicks Remaining:</strong> {selectedSubmission.ppuOptimizationClicksRemaining}</Text>
                    )}
                    
                    <Heading size="xs" mt={4} mb={2}>Keyword Analysis</Heading>
                    {selectedSubmission.keywordAnalysis ? (
                        <Box fontSize="sm">
                            <Text fontWeight="bold">Matched:</Text>
                            <List spacing={1} pl={2} mb={2}>
                                {selectedSubmission.keywordAnalysis.matchedKeywords?.map((kw, i) => <ListItem key={`m-${i}`}>{kw}</ListItem>) || <ListItem>None</ListItem>}
                            </List>
                            <Text fontWeight="bold">Missing:</Text>
                            <List spacing={1} pl={2}>
                                {selectedSubmission.keywordAnalysis.missingKeywords?.map((kw, i) => <ListItem key={`miss-${i}`}>{kw}</ListItem>) || <ListItem>None</ListItem>}
                            </List>
                        </Box>
                    ) : <Text fontSize="sm">N/A</Text>}
                    
                    <Heading size="xs" mt={4} mb={2}>Suggestions / Feedback</Heading>
                     {Array.isArray(selectedSubmission.feedback) ? (
                         <List spacing={1} fontSize="sm">
                         {selectedSubmission.feedback.map((item, index) => (
                             <ListItem key={index} display="flex" alignItems="center">
                                <ListIcon 
                                   as={item.type === 'positive' ? CheckCircleIcon : WarningIcon} 
                                   color={item.type === 'positive' ? 'green.500' : 'orange.500'} 
                                   mr={2}
                                />
                                {item.message || item}
                             </ListItem>
                         ))}
                         </List>
                     ) : <Text fontSize="sm">N/A</Text>}
                  </TabPanel>
                  
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                         <FormControl>
                             <FormLabel>Job Description for Optimization</FormLabel>
                             <Textarea 
                                placeholder="Paste the full job description here..."
                                value={jobDescriptionText}
                                onChange={(e) => setJobDescriptionText(e.target.value)}
                                rows={10}
                              />
                         </FormControl>
                         <Button 
                            colorScheme="blue" 
                            onClick={handleUpdateJobDescription} 
                            isLoading={isJdLoading}
                            isDisabled={selectedSubmission.jobDescription === jobDescriptionText}
                         >
                            Save Job Description
                         </Button>
                    </VStack>
                  </TabPanel>
                  
                  <TabPanel>
  <VStack spacing={4} align="stretch">
    <Heading size="sm" mb={2}>Run Analysis / Order Review</Heading>
    
    {/* Review status alert */}
    {isUnderReview && (
      <Alert status='info' variant='subtle' flexDirection='column' alignItems='center' justifyContent='center' textAlign='center' height='100px'>
        <AlertIcon boxSize='40px' mr={0} />
        <Text mt={2} fontSize="sm">This resume is currently under professional review.</Text>
      </Alert>
    )}

    {/* Detailed ATS Report Button */}
    <Button 
      leftIcon={<RepeatIcon />} 
      colorScheme="cyan" 
      onClick={() => handleTriggerAnalysis('detailed_ats', selectedSubmission.id)}
      isLoading={isActionLoading}
      isDisabled={
        isActionLoading || 
        isUnderReview || 
        (user?.subscriptionStatus !== 'premium' && 
        (!user?.ppuAtsCredits || user.ppuAtsCredits <= 0))
      }
      title={
        isUnderReview ? 'Resume under review' : 
        (user?.subscriptionStatus !== 'premium' && 
        (!user?.ppuAtsCredits || user.ppuAtsCredits <= 0) ? 
        'No ATS credits remaining' : '')
      }
    >
      Run Detailed ATS Report {user?.subscriptionStatus !== 'premium' && '(Uses 1 Credit)'}
    </Button>

    {/* Job Optimization Button */}
    <Button 
      leftIcon={<EditIcon />} 
      colorScheme="purple" 
      onClick={() => handleTriggerAnalysis('job_optimization', selectedSubmission.id)}
      isLoading={isActionLoading}
      isDisabled={
        isActionLoading || 
        isUnderReview || 
        !selectedSubmission?.jobDescription || 
        (user?.subscriptionStatus !== 'premium' && 
        (!user?.ppuOptimizationCredits || user.ppuOptimizationCredits <= 0))
      }
      title={
        isUnderReview ? 'Resume under review' : 
        (!selectedSubmission?.jobDescription ? 'Add job description first' : 
        (user?.subscriptionStatus !== 'premium' && 
        (!user?.ppuOptimizationCredits || user.ppuOptimizationCredits <= 0) ? 
        'No Optimization credits remaining' : ''))
      }
    >
      Run Job Optimization {user?.subscriptionStatus !== 'premium' && '(Uses 1 Credit)'}
    </Button>

    {/* Professional Review Button */}
    <Button 
      leftIcon={<ChatIcon />} 
      colorScheme="teal" 
      onClick={() => handlePayment('review', selectedSubmission.id)}
      isLoading={isActionLoading}
      isDisabled={
        isActionLoading || 
        isUnderReview || 
        reviewOrders.some(r => r.resumeId === selectedSubmission.id)
      }
      title={
        isUnderReview ? 'Resume under review' : 
        (reviewOrders.some(r => r.resumeId === selectedSubmission.id) ? 
        'Review already ordered or in progress' : '')
      }
    >
      Order Professional Review ($30)
    </Button>

    {/* Resume Editor Button */}
    <Button 
      leftIcon={<EditIcon />} 
      colorScheme="yellow" 
      onClick={() => navigate(`/resume-editor/${selectedSubmission.id}`)}
      isDisabled={isActionLoading || isUnderReview}
      title={isUnderReview ? 'Resume under review' : ''}
    >
      Edit Resume
    </Button>
  </VStack>
</TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleFeedbackModalClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      <Modal isOpen={isReviewModalOpen} onClose={onReviewModalClose} size="lg">
         <ModalOverlay />
         <ModalContent>
             <ModalHeader>Review Details: {selectedReview?.resume?.originalFileName}</ModalHeader>
             <ModalCloseButton />
             <ModalBody>
                {selectedReview && (
                    <VStack spacing={3} align="start">
                        <Text><strong>Status:</strong> <Badge colorScheme={getStatusColor(selectedReview.status)}>{selectedReview.status}</Badge></Text>
                        <Text><strong>Submitted:</strong> {new Date(selectedReview.submittedDate).toLocaleString()}</Text>
                        {selectedReview.completedDate && <Text><strong>Completed:</strong> {new Date(selectedReview.completedDate).toLocaleString()}</Text>}
                        <Heading size="sm" mt={4}>Reviewer Feedback:</Heading>
                        <Text whiteSpace="pre-wrap" fontFamily="monospace" bg={feedbackBgColor} p={3} borderRadius="md" w="full">
                           {selectedReview.reviewerFeedback || 'No feedback provided yet.'}
                        </Text>
                    </VStack>
                )}
             </ModalBody>
             <ModalFooter>
                <Button onClick={onReviewModalClose}>Close</Button>
             </ModalFooter>
         </ModalContent>
      </Modal>
    </Box>
  );
}
