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
  List,
  ListItem,
  ListIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
  InputGroup,
  InputRightElement,
  Center,
  Image, // Import Image component
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaCheck, FaFileAlt, FaClock, FaRobot, FaUserTie, FaCheckCircle, FaChartLine, FaRegPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);
const MotionImage = motion(Image); // Motion for Image if needed

export default function Home() {
  const purpleGradient = 'linear(to-r, #667eea, #764ba2)';
  const buttonGradient = 'linear(135deg, #667eea 0%, #764ba2 100%)';
  const buttonHoverGradient = 'linear(135deg, #764ba2 0%, #667eea 100%)';
  const lightBg = 'white';
  const darkBg = 'gray.800';
  const lightSectionBg = 'gray.50';
  const darkSectionBg = 'gray.900';
  const lightBorder = 'gray.200';
  const darkBorder = 'gray.700';
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.800', 'white');

  // Statistics Data - Updated to match design
  const stats = [
    { value: '100+', label: 'Resumes Optimized' },
    { value: '85%', label: 'Success Rate', subLabel: 'Interview callbacks' },
    { value: '92%', label: 'Job Offers', subLabel: 'Within 3 months' },
    { value: '4.9/5', label: 'Client Satisfaction', subLabel: 'Based on 50+ reviews' },
  ];

  // Why Choose Us Features - Content from design
   const features = [
    {
      icon: FaRobot,
      title: 'AI-Powered Analysis',
      text: 'Our advanced AI technology analyzes your resume against industry standards and job requirements.',
    },
    {
      icon: FaUserTie,
      title: 'Expert Review',
      text: 'Professional resume writers review and optimize your content for maximum impact.',
    },
    {
      icon: FaChartLine, // Assuming based on common offerings
      title: 'Proven Results',
      text: 'Our data-driven approach has helped thousands land their dream jobs.',
    },
    {
      icon: FaClock, // Assuming based on common offerings
      title: 'Quick Turnaround', // Keeping this for completeness, adjust if needed
      text: 'Get your optimized resume back quickly to meet application deadlines.',
    },
  ];


  // Pricing Tiers - Updated to match design
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
    },
    {
      title: 'Premium Subscription',
      price: '$20 / review',
      description: 'Unlimited access for active job seekers.',
      features: [
        'All Free Tier features',
        '20 Detailed ATS Reports (AI-Powered)',
        '10 Job-Specific Optimizations (AI-Powered)',
        '5 AI Analysis clicks in Editor',
        'Store multiple resume versions',
        'Cancel Anytime',
      ],
    },
    {
      title: 'Pay-Per-Use (PPU)',
      price: '$5 / report or $10 / optimization',
      description: 'Optimize specific resumes as needed.',
      features: [
        'Detailed ATS Report ($5 each)',
        'Job-Specific Optimization ($10 each)',
        'Includes limited analysis clicks per purchase (5)',
        'Ideal for occasional users',
      ],
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
    },
  ];

  const testimonials = [
    {
      text: 'The resume optimizer I used was a gamechanger! I started getting calls from tech giants within weeks!',
      name: 'John Smith',
    },
    {
      text: 'The AI analysis helped me fix missing info from my resume. Highly recommend!',
      name: 'Sarah Johnson',
    },
    {
      text: 'Professional, quick, and effective service! Got my dream job within a month using their service.',
      name: 'Michael Chen',
    },
  ];

  // FAQ Data - Seems consistent with design
  const faqs = [
    {
      question: 'How does the AI-powered resume optimization work?',
      answer: 'Our AI analyzes your resume against industry standards, keywords, and formatting best practices for Applicant Tracking Systems (ATS) to provide tailored suggestions for improvement.',
    },
    {
      question: 'How long does the resume optimization process take?',
      answer: 'The turnaround time depends on the service selected. Our AI analysis is typically very fast (minutes), while expert reviews usually take 24-72 hours.',
    },
    {
      question: 'Will my resume be ATS-friendly?',
      answer: 'Yes, a core focus of our optimization is ensuring your resume is formatted correctly and contains relevant keywords to pass through Applicant Tracking Systems effectively.',
    },
    {
      question: 'Can I request revisions after receiving my optimized resume?',
      answer: 'Yes.',
    },
    {
      question: 'Do you offer refunds if I’m not satisfied?',
      answer: 'We strive for 100% satisfaction. While results depend on many factors, if you are unhappy with the service provided, please contact our support team to discuss options based on our Refund Policy.',
    },
  ];

  return (
    <Box width="100vw" minH="100vh" overflowX="hidden">
      {/* Hero Section - Updated Layout */}
      <Container maxW="container.xl" py={{ base: 10, md: 16 }} px={{ base: 4, md: 8 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
          <Stack spacing={6}>
            <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Heading
                as="h1"
                fontWeight={700} // Slightly bolder
                fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
                lineHeight="120%"
                color={headingColor}
              >
                Land Your Dream Job with an <br />
                <MotionText
                  as="h1"
                  fontWeight={700} // Slightly bolder
                fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
                  bgGradient={purpleGradient}
                  bgClip="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Optimized Resume
                </MotionText>
              </Heading>
            </MotionBox>

            <MotionText
              color={textColor}
              fontSize={{ base: 'lg', md: 'xl' }}
              maxW="lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Our Human + AI-powered platform and expert reviewers help you create a resume that stands out. Get more interviews and better job offers.
            </MotionText>

            <Stack
              direction={{ base: 'column', sm: 'row' }}
              spacing={4}
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {/* Link component wraps Button */}
              <Link to="/upload" style={{ textDecoration: 'none' }}>
                <Button
                  size={{ base: 'md', md: 'lg' }}
                  px={8}
                  bgGradient={buttonGradient}
                  color="white"
                  rounded="md" // Changed from full
                  _hover={{
                    bgGradient: buttonHoverGradient,
                    boxShadow: 'md', // Subtle shadow
                    transform: 'translateY(-2px)',
                  }}
                  transition="all 0.2s ease-in-out"
                  rightIcon={<Icon as={FaRegPaperPlane} />} // Added icon matching Get Started
                >
                  Get Started Now
                </Button>
              </Link>
              <Link to="/services" style={{ textDecoration: 'none' }}>
                 <Button
                   size={{ base: 'md', md: 'lg' }}
                   px={8}
                   variant="outline" // Outline style
                   borderColor="purple.500" // Border color
                   color="purple.500" // Text color
                   rounded="md" // Changed from full
                   _hover={{
                     bg: useColorModeValue('purple.50', 'purple.900'), // Light hover background
                     transform: 'translateY(-2px)',
                     boxShadow: 'sm', // Subtle shadow
                   }}
                   transition="all 0.2s ease-in-out"
                   leftIcon={<Icon as={FaFileAlt} h={5} w={5} />} // Icon removed to match design
                 >
                   View Services
                 </Button>
               </Link>
            </Stack>
          </Stack>

          {/* Resume Preview Images Area - Matching design */}
           <Flex display={{ base: 'none', md: 'flex' }} justifyContent="center" alignItems="center" position="relative" >
        
        <MotionBox
            position="relative"
            w="full"
            h="450px"
            transform="rotate(-5deg)"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
        >
            <MotionImage
                src="/one.jpg"
                alt="Resume Preview 1"
                boxShadow="lg"
                rounded="md"
                maxW="280px"
                position="absolute"
                top="0"
                left="10%"
                zIndex={1}
                objectFit="contain"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            />
            <MotionImage
                src="/two.jpg"
                alt="Resume Preview 2"
                boxShadow="xl"
                rounded="md"
                maxW="280px"
                position="absolute"
                top="40px"
                left="calc(10% + 120px)"
                zIndex={0}
                objectFit="contain"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            />
            <MotionImage
                src="/three.jpg"
                alt="Resume Preview 3"
                boxShadow="md"
                rounded="md"
                maxW="250px"
                position="absolute"
                bottom="20px" 
                right="5%"
                zIndex={2}
                objectFit="contain"
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
            />
        </MotionBox>
      </Flex>
        </SimpleGrid>
      </Container>

      {/* Statistics Section - Updated Styling */}
       <Box bg={useColorModeValue('purple.50', 'purple.900')} py={{ base: 10, md: 16 }}>
         <Container maxW="container.lg">
           <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 6, md: 8 }}>
             {stats.map((stat, index) => (
               <VStack key={index} spacing={0} textAlign="center">
                 <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" color={useColorModeValue('purple.600', 'purple.300')}>
                   {stat.value}
                 </Text>
                 <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="medium" color={headingColor}>
                   {stat.label}
                 </Text>
                 {stat.subLabel && (
                   <Text fontSize="sm" color={textColor}>
                     {stat.subLabel}
                   </Text>
                 )}
               </VStack>
             ))}
           </SimpleGrid>
         </Container>
       </Box>

      {/* Why Choose Us Section - Matched design */}
      <Box py={{ base: 12, md: 20 }} width="100%" bg={lightSectionBg}>
        <Container maxW="container.lg">
          <VStack spacing={{ base: 8, md: 12 }} width="100%">
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
                  color={headingColor} // Removed gradient to match design
                >
                  Why Choose Us
                </Heading>
                <Text color={textColor} fontSize={{ base: 'md', md: 'lg' }} maxW="2xl">
                  Our professional resume optimization service helps you stand out in today’s competitive job market.
                </Text>
              </VStack>
            </MotionBox>

            {/* Using 2 columns as per the visible part of the design */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8 }} width="100%" pt={4}>
              {/* Displaying only the first two features shown in the design */}
              {features.slice(0, 2).map((feature, index) => (
                <MotionBox
                  key={index}
                  bg={useColorModeValue('white', darkBg)}
                  p={{ base: 6, md: 8 }}
                  rounded="lg" // Less rounded corners
                  shadow="sm" // Subtle shadow
                  border="1px"
                  borderColor={useColorModeValue(lightBorder, darkBorder)}
                  whileHover={{
                    shadow: 'md', // Slightly larger shadow on hover
                    borderColor: 'purple.300',
                    transition: { duration: 0.2 },
                  }}
                >
                  <VStack spacing={4} align="flex-start">
                    {/* Icon styling simplified */}
                    <Flex
                      w={12}
                      h={12}
                      align="center"
                      justify="center"
                      rounded="md" // Square with rounded corners
                      bg={useColorModeValue('purple.100', 'purple.900')}
                      color={useColorModeValue('purple.600', 'purple.300')}
                    >
                      <Icon as={feature.icon} w={6} h={6} />
                    </Flex>
                    <Text fontWeight="bold" fontSize="xl" color={headingColor}>
                      {feature.title}
                    </Text>
                    <Text color={textColor} fontSize="md">
                      {feature.text}
                    </Text>
                  </VStack>
                </MotionBox>
              ))}
               {/* Adding the next two features below */}
              {features.slice(2, 4).map((feature, index) => (
                 <MotionBox
                   key={index + 2} // Ensure unique key
                   bg={useColorModeValue('white', darkBg)}
                   p={{ base: 6, md: 8 }}
                   rounded="lg"
                   shadow="sm"
                   border="1px"
                   borderColor={useColorModeValue(lightBorder, darkBorder)}
                   whileHover={{
                     shadow: 'md',
                     borderColor: 'purple.300',
                     transition: { duration: 0.2 },
                   }}
                 >
                   <VStack spacing={4} align="flex-start">
                     <Flex
                       w={12}
                       h={12}
                       align="center"
                       justify="center"
                       rounded="md"
                       bg={useColorModeValue('purple.100', 'purple.900')}
                       color={useColorModeValue('purple.600', 'purple.300')}
                     >
                       <Icon as={feature.icon} w={6} h={6} />
                     </Flex>
                     <Text fontWeight="bold" fontSize="xl" color={headingColor}>
                       {feature.title}
                     </Text>
                     <Text color={textColor} fontSize="md">
                       {feature.text}
                     </Text>
                   </VStack>
                 </MotionBox>
               ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Pricing Section - Updated with design content */}
      <Box py={{ base: 12, md: 20 }} width="100%" bg={useColorModeValue('white', 'gray.800')}>
        <Container maxW="100%" px={{ base: 4, md: 8 }} centerContent>
          <VStack spacing={{ base: 8, md: 12 }} width="100%" maxW={{ base: '100%', md: '90%', lg: '80%' }}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              width="100%"
            >
              <VStack spacing={4} textAlign="center">
                <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>Our Resume Services</Heading>
                <Text color="gray.500" fontSize={{ base: 'md', md: 'lg' }}>
                  Choose from our range of professional resume optimization services.
                </Text>
              </VStack>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8, lg: 10 }} width="100%">
              {tiers.map((tier, index) => (
                <Box
                  key={index}
                  bg={useColorModeValue('white', 'gray.700')}
                  p={6}
                  rounded="xl"
                  shadow="base"
                  border="1px"
                  borderColor={useColorModeValue('gray.100', 'gray.600')}
                >
                  <VStack spacing={4} align="stretch">
                    <Heading size="md">{tier.title}</Heading>
                    <Text fontSize="2xl" fontWeight="bold">
                      {tier.price}
                    </Text>
                    <Text color="gray.500">{tier.description}</Text>
                    <List spacing={2}>
                      {tier.features.map((feature, idx) => (
                        <ListItem key={idx} display="flex" alignItems="center">
                          <ListIcon as={FaCheckCircle} color="green.500" />
                          {feature}
                        </ListItem>
                      ))}
                    </List>
                    <Link to="/services">
                      <Button colorScheme="purple" mt={4}>
                        Choose
                      </Button>
                    </Link>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* What Our Clients Say Section - Matched Design */}
      <Box py={{ base: 12, md: 20 }} width="100%" bg={lightSectionBg}>
        <Container maxW="container.lg">
          <VStack spacing={{ base: 8, md: 12 }} width="100%">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              width="100%"
            >
              <VStack spacing={4} textAlign="center">
                <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} color={headingColor}>What Our Clients Say</Heading>
                <Text color={textColor} fontSize={{ base: 'md', md: 'lg' }} maxW="2xl">
                  Real success stories from professionals who transformed their careers with our service.
                </Text>
              </VStack>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }} width="100%">
              {testimonials.map((testimonial, index) => (
                <Box
                  key={index}
                  bg={useColorModeValue('white', darkBg)}
                  p={6}
                  rounded="lg"
                  shadow="sm"
                  border="1px"
                  borderColor={useColorModeValue(lightBorder, darkBorder)}
                  textAlign="center" // Center align text
                >
                  {/* Placeholder for Avatar/Image if needed in future */}
                   {/* <Center pb={4}> <Avatar size="lg" name={testimonial.name} /> </Center> */}
                  <Text fontStyle="italic" color={textColor}>"{testimonial.text}"</Text>
                  <Text mt={4} fontWeight="bold" color={headingColor}>
                    {testimonial.name}
                  </Text>
                  {/* Title removed as per request */}
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* FAQ Section - Matched Design */}
       <Box py={{ base: 12, md: 20 }} width="100%" bg={lightBg}>
         <Container maxW="container.lg"> {/* Consistent width */}
           <VStack spacing={{ base: 8, md: 12 }} width="100%" maxW="4xl" mx="auto"> {/* Centered and max width */}
             <MotionBox
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5 }}
               width="100%"
             >
               <VStack spacing={4} textAlign="center">
                 <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} color={headingColor}>Frequently Asked Questions</Heading>
                 <Text color={textColor} fontSize={{ base: 'md', md: 'lg' }}>
                   Get answers to common questions about our resume optimization service.
                 </Text>
               </VStack>
             </MotionBox>

             <Accordion allowToggle width="100%" bg={useColorModeValue('white', darkBg)} rounded="lg" shadow="sm" border="1px" borderColor={useColorModeValue(lightBorder, darkBorder)}>
               {faqs.map((faq, index) => (
                 <AccordionItem key={index} borderBottomWidth={index === faqs.length - 1 ? '0' : '1px'} borderColor={useColorModeValue(lightBorder, darkBorder)}>
                   <h2>
                     <AccordionButton _expanded={{ bg: useColorModeValue('purple.50', 'purple.900'), color: useColorModeValue('purple.700', 'purple.200') }} py={4} px={6}>
                       <Box flex="1" textAlign="left" fontWeight="medium" color={headingColor}>
                         {faq.question}
                       </Box>
                       <AccordionIcon />
                     </AccordionButton>
                   </h2>
                   <AccordionPanel pb={4} px={6} color={textColor} fontSize="md">
                     {faq.answer}
                   </AccordionPanel>
                 </AccordionItem>
               ))}
             </Accordion>

              {/* Added 'Still have questions?' part from design */}
             <Text pt={6} color={textColor}>
                Still have questions? Contact us at{' '}
                <Link href="mailto:support@resumeoptimizer.io" style={{ color: '#6B46C1', textDecoration: 'underline' }}>
                    support@resumeoptimizer.io
                </Link>
             </Text>

           </VStack>
         </Container>
       </Box>

      {/* Footer section would go here - outside the scope of Home component modification based on prompt */}

    </Box>
  );
}
