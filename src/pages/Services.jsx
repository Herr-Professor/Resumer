import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    List,
    ListItem,
    ListIcon,
    Button,
    VStack,
    useColorModeValue,
    Icon,
    Divider,
    useToast,
  } from '@chakra-ui/react'
  import { CheckCircleIcon, StarIcon, InfoOutlineIcon, LockIcon } from '@chakra-ui/icons'
  import { Link, useNavigate } from 'react-router-dom'
  import { motion } from 'framer-motion'
  import { useAuth } from '../context/AuthContext'
  import axios from 'axios'
  import { API_ENDPOINTS } from '../config/api'
  import { loadStripe } from '@stripe/stripe-js'
  
  const MotionBox = motion(Box)
  
  // Load Stripe
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_YOUR_PUBLIC_KEY')
  
  export default function Services() {
    const { user, loading: authLoading } = useAuth()
    const navigate = useNavigate()
    const toast = useToast()
    const [isLoadingPayment, setIsLoadingPayment] = useState(null)
  
    const bgColor = useColorModeValue('gray.50', 'gray.900')
    const cardBg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.100', 'gray.700')
    const textColor = useColorModeValue('gray.600', 'gray.300')
    const accentColor = useColorModeValue('purple.600', 'purple.300')
  
    // Define Tiers based on Resopt.txt
    const tiers = [
      {
        title: 'Free Tier',
        price: '$0',
        description: 'Get started and see basic ATS compatibility.',
        features: [
          'Account Sign-up',
          'Resume Upload (PDF, DOCX)',
          'Basic ATS Check & Score',
          'General ATS Feedback',
        ],
        ctaText: 'Get Started',
        ctaAction: () => navigate('/register'),
        serviceType: null,
        requiresLogin: false,
        isCurrent: !user,
      },
      {
        title: 'Premium Subscription',
        price: '$15 / month',
        description: 'Unlimited access for active job seekers.',
        features: [
          'All Free Tier features',
          'Unlimited Detailed ATS Reports (AI-Powered)',
          'Unlimited Job-Specific Optimizations (AI-Powered)',
          'Unlimited AI Analysis clicks in Editor',
          '(Potentially) Store multiple resume versions',
          'Cancel Anytime',
        ],
        ctaText: user?.subscriptionStatus === 'premium' ? 'Currently Subscribed' : 'Go Premium',
        ctaAction: () => handlePayment('subscription'),
        serviceType: 'subscription',
        requiresLogin: true,
        isCurrent: user?.subscriptionStatus === 'premium',
      },
      {
        title: 'Pay-Per-Use (PPU)',
        price: '$5 / report or $10 / optimization',
        description: 'Optimize specific resumes as needed.',
        features: [
          'Detailed ATS Report ($5 each)',
          'Job-Specific Optimization ($10 each)',
          'Includes limited analysis clicks per purchase (3-5)',
          'Ideal for occasional users',
        ],
        ctaText: 'Buy Credits on Dashboard',
        ctaAction: () => navigate('/dashboard'),
        serviceType: null,
        requiresLogin: true,
        isCurrent: false,
      },
      {
        title: 'Professional Review',
        price: '$30 / review',
        description: 'Personalized feedback from a human expert.',
        features: [
          'Manual review by a qualified expert',
          'Focus on clarity, impact, strategy',
          'Complements AI analysis',
          'Actionable written feedback (1-2 business days)',
        ],
        ctaText: 'Order on Dashboard',
        ctaAction: () => navigate('/dashboard'),
        serviceType: 'review',
        requiresLogin: true,
        isCurrent: false,
      },
    ]
  
    const handlePayment = async (serviceType, resumeId = null) => {
      if (!user) {
        toast({ title: 'Login Required', description: 'Please log in or sign up to make a purchase.', status: 'warning' })
        navigate('/login')
        return
      }
  
      setIsLoadingPayment(serviceType)
      const token = localStorage.getItem('token')
      try {
        const payload = { serviceType, userId: user.id }
        if (resumeId) {
          payload.resumeId = resumeId
        }
        const response = await axios.post(
          API_ENDPOINTS.payments.createCheckout,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
  
        const stripe = await stripePromise
        if (response.data.url) {
          window.location.href = response.data.url
        } else {
          throw new Error('Checkout URL not received from server.')
        }
  
      } catch (error) {
        toast({
          title: 'Payment Error',
          description: error.response?.data?.error || error.message || 'Could not initiate payment process.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        console.error("Payment initiation error:", error)
        setIsLoadingPayment(null)
      }
    }
  
    useEffect(() => {
      // Check for payment success
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      const sessionId = urlParams.get('session_id');
      
      if (success && sessionId) {
        const verifyPayment = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
              `${API_ENDPOINTS.payments.checkPayment(sessionId)}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.status === 'paid') {
              toast({
                title: 'Payment Successful',
                description: 'Your credits have been added to your account.',
                status: 'success',
                duration: 5000,
                isClosable: true,
              });
            }
            
            // Clean up URL parameters
            window.history.replaceState({}, document.title, '/services');
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
    }, [toast]);
  
    return (
      <Box
        width="100vw"
        minH="100vh"
        bg={bgColor}
        py={{ base: 12, md: 20 }}
        overflow="hidden"
        position="relative"
      >
        {/* Animated Background Elements - matching Home page */}
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
  
        <Container maxW={{ base: "100%", md: "90%", lg: "80%", xl: "1200px" }} px={{ base: 4, md: 8 }} position="relative">
          <VStack spacing={{ base: 8, md: 12 }} align="stretch">
            <Box textAlign="center">
              <Heading
                as={motion.h1}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                fontSize={{ base: '2xl', sm: '4xl', md: '5xl' }}
                mb={3}
                bgGradient="linear(to-r, #667eea, #764ba2)"
                bgClip="text"
                lineHeight={{ base: "120%", md: "110%" }}
              >
                Choose Your Plan
              </Heading>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color={textColor}
                as={motion.p}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                maxW={{ base: "100%", md: "80%" }}
                mx="auto"
              >
                Select the option that best fits your job search needs, from free basic checks to unlimited AI-powered optimization and expert reviews.
              </Text>
            </Box>
  
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={{ base: 6, md: 8 }}
              as={motion.div}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {tiers.map((tier) => (
                <MotionBox
                  key={tier.title}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <Box
                    bg={cardBg}
                    p={{ base: 5, md: 6 }}
                    rounded="xl"
                    shadow="base"
                    borderWidth="1px"
                    borderColor={tier.isCurrent ? accentColor : borderColor}
                    h="full"
                    display="flex"
                    flexDirection="column"
                    transition="all 0.2s"
                    _hover={{
                      transform: 'translateY(-4px)',
                      shadow: 'lg',
                    }}
                  >
                    <VStack spacing={4} align="stretch" flex="1">
                      <Box textAlign="center">
                        <Heading
                          fontSize={{ base: 'xl', md: '2xl' }}
                          fontWeight="semibold"
                          color={tier.isCurrent ? accentColor : undefined}
                        >
                          {tier.title}
                        </Heading>
                        <Text
                          fontSize={{ base: '2xl', md: '3xl' }}
                          fontWeight="bold"
                          mt={2}
                        >
                          {tier.price}
                        </Text>
                        <Text
                          color={textColor}
                          fontSize={{ base: "sm", md: "md" }}
                          mt={2}
                          minHeight={{ base: "40px", md: "60px"}}
                        >
                          {tier.description}
                        </Text>
                      </Box>
  
                      <Divider />
  
                      <List spacing={2} flex="1" mt={4} fontSize={{ base: "sm", md: "md" }}>
                        {tier.features.map((feature) => (
                          <ListItem
                            key={feature}
                            display="flex"
                            alignItems="center"
                          >
                            <ListIcon
                              as={CheckCircleIcon}
                              color="green.500"
                              fontSize={{ base: "md", md: "lg" }}
                              mr={2}
                            />
                            {feature}
                          </ListItem>
                        ))}
                      </List>
  
                      <Box mt="auto" pt={4}>
                        {tier.title === 'Pay-Per-Use (PPU)' ? (
                          <VStack spacing={3}>
                            <Button
                              w="100%"
                              rounded="md"
                              size="md"
                              variant="outline"
                              colorScheme="blue"
                              isLoading={isLoadingPayment === 'ppu_ats'}
                              isDisabled={authLoading || !!isLoadingPayment}
                              onClick={() => handlePayment('ppu_ats')}
                            >
                              Buy ATS Report Credit ($5)
                            </Button>
                            <Button
                              w="100%"
                              rounded="md"
                              size="md"
                              variant="outline"
                              colorScheme="orange"
                              isLoading={isLoadingPayment === 'ppu_optimization'}
                              isDisabled={authLoading || !!isLoadingPayment}
                              onClick={() => handlePayment('ppu_optimization')}
                            >
                              Buy Optimization Credit ($10)
                            </Button>
                          </VStack>
                        ) : (
                          <Button
                            w="100%"
                            rounded="md"
                            size="lg"
                            colorScheme={tier.title === 'Premium Subscription' ? 'purple' : 'gray'}
                            variant={tier.isCurrent ? 'solid' : (tier.title === 'Premium Subscription' ? 'solid' : 'outline')}
                            onClick={tier.ctaAction}
                            isDisabled={authLoading || (tier.requiresLogin && !user && tier.title !== 'Free Tier') || (tier.title === 'Premium Subscription' && user?.subscriptionStatus === 'premium') || !!isLoadingPayment}
                            isLoading={tier.serviceType === 'subscription' && isLoadingPayment === 'subscription'}
                            leftIcon={tier.requiresLogin && !user ? <LockIcon /> : (tier.isCurrent ? <StarIcon /> : null)}
                          >
                            {tier.requiresLogin && !user && tier.title !== 'Free Tier' ? 'Login to Continue' : tier.ctaText}
                          </Button>
                        )}
                      </Box>
                    </VStack>
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>
  
            <Box
              textAlign="center"
              mt={{ base: 8, md: 12 }}
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color="gray.500"
                mb={4}
              >
                Questions? Contact us at{' '}
                <Link href="mailto:support@resumeoptimizer.io" color={accentColor}>
                  support@resumeoptimizer.io
                </Link>
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    )
  }