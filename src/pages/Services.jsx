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
  } from '@chakra-ui/react'
  import { CheckCircleIcon } from '@chakra-ui/icons'
  import { Link } from 'react-router-dom'
  import { motion } from 'framer-motion'
  
  const MotionBox = motion(Box)
  
  export default function Services() {
    const services = [
      {
        title: 'Basic Resume Edit',
        price: '$5',
        description: 'Perfect for a quick touch-up',
        features: [
          'Grammar and spelling check',
          'Basic formatting optimization',
          'Structure improvements',
          '24-hour delivery',
          'One revision included'
        ]
      },
      {
        title: 'Premium Resume Edit',
        price: '$10',
        description: 'Comprehensive optimization',
        features: [
          'Includes all Basic Edit features',
          'ATS keyword optimization',
          'Content restructuring',
          'Industry-specific suggestions',
          'Career coaching tips',
          'Two revisions included'
        ]
      },
      {
        title: 'Urgent Resume Edit',
        price: '$25',
        description: 'Need it fast? We\'ve got you covered',
        features: [
          'Includes all Premium Edit features',
          'Same-day delivery',
          'Priority support',
          'Three revisions included',
          'Emergency weekend service'
        ]
      },
      {
        title: 'Job Application Service',
        price: '$150',
        description: 'Complete job application management for one week',
        features: [
          'Based on your optimized resume',
          'Tailored applications for job descriptions',
          'Cover letter writing (if required)',
          'Submission of applications',
          'Monitoring and follow-up'
        ]
      }
    ]
  
    return (
      <Box
        width="100vw"
        minH="100vh"
        bg={useColorModeValue('gray.50', 'gray.900')}
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
                Our Resume Optimization Services
              </Heading>
              <Text
                fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                color={useColorModeValue('gray.500', 'gray.300')}
                as={motion.p}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                maxW={{ base: "100%", md: "90%", lg: "80%" }}
                mx="auto"
              >
                Choose the perfect plan to enhance your career prospects
              </Text>
            </Box>
  
            <SimpleGrid
              columns={{ base: 1, md: 2, xl: 4 }}
              spacing={{ base: 4, md: 6, lg: 8 }}
              as={motion.div}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {services.map((service) => (
                <MotionBox
                  key={service.title}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <Box
                    bg={useColorModeValue('white', 'gray.800')}
                    p={{ base: 4, md: 6, lg: 8 }}
                    rounded="xl"
                    shadow="base"
                    borderWidth="1px"
                    borderColor={useColorModeValue('gray.100', 'gray.700')}
                    h="full"
                    display="flex"
                    flexDirection="column"
                    whileHover={{
                      y: -5,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      transition: { duration: 0.2 }
                    }}
                  >
                    <VStack spacing={{ base: 3, md: 4 }} align="stretch" flex="1">
                      <Box>
                        <Text
                          fontSize={{ base: 'xl', md: '2xl' }}
                          fontWeight="bold"
                          bgGradient="linear(to-r, #667eea, #764ba2)"
                          bgClip="text"
                        >
                          {service.title}
                        </Text>
                        <Text 
                          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} 
                          fontWeight="bold"
                          mt={2}
                        >
                          {service.price}
                        </Text>
                        <Text 
                          color="gray.500"
                          fontSize={{ base: "xs", md: "sm", lg: "md" }}
                          mt={2}
                        >
                          {service.description}
                        </Text>
                      </Box>
  
                      <List spacing={{ base: 2, md: 3 }} flex="1" mt={4}>
                        {service.features.map((feature) => (
                          <ListItem 
                            key={feature} 
                            fontSize={{ base: "xs", md: "sm", lg: "md" }}
                            display="flex"
                            alignItems="center"
                          >
                            <ListIcon 
                              as={CheckCircleIcon} 
                              color="green.500"
                              fontSize={{ base: "sm", md: "md", lg: "lg" }}
                              mr={2}
                            />
                            {feature}
                          </ListItem>
                        ))}
                      </List>
  
                      <Link to="/upload" style={{ width: '100%', marginTop: 'auto' }}>
                        <Button
                          w="100%"
                          rounded="full"
                          size={{ base: "sm", md: "md", lg: "lg" }}
                          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          color="white"
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                            bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
                          }}
                          transition="all 0.2s"
                        >
                          Choose {service.title}
                        </Button>
                      </Link>
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
                fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                color="gray.500"
                mb={4}
              >
                Not sure which plan is right for you?
              </Text>
              <Text 
                fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                color="gray.500"
                mb={4}
              >
                support@resumeoptimizer.io
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    )
  }