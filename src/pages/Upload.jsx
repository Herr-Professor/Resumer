import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Radio,
  RadioGroup,
  Stack,
  HStack,
  useColorModeValue,
  Textarea,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const MotionBox = motion(Box)

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [plan, setPlan] = useState('basic')
  const [jobInterest, setJobInterest] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a resume file to upload',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('resume', selectedFile)
      formData.append('userId', user.id)
      formData.append('plan', plan)
      formData.append('jobInterest', jobInterest)
      formData.append('description', description)

      const token = localStorage.getItem('token')
      await axios.post(API_ENDPOINTS.resumes.submit, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      toast({
        title: 'Upload successful',
        description: 'Your resume has been uploaded and will be processed soon',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      navigate('/dashboard')
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.response?.data?.error || 'An error occurred while uploading your resume',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const prices = {
    basic: 5,
    premium: 10,
    urgent: 25,
    jobApplication: 150
  }

  const services = [
    {
      value: 'basic',
      title: 'Basic Resume Edit',
      description: 'Grammar and spelling check, basic formatting optimization, structure improvements, 24-hour delivery, one revision included'
    },
    {
      value: 'premium',
      title: 'Premium Resume Edit',
      description: 'Comprehensive optimization, includes all Basic Edit features, ATS keyword optimization, content restructuring, industry-specific suggestions, career coaching tips, two revisions included'
    },
    {
      value: 'urgent',
      title: 'Urgent Resume Edit',
      description: 'Includes all Premium Edit features, same-day delivery, priority support, three revisions included, emergency weekend service'
    },
    {
      value: 'jobApplication',
      title: 'Job Application Service',
      description: 'Complete job application management for one week, tailored applications for job descriptions, cover letter writing, submission of applications, monitoring and follow-up'
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
              Upload Your Resume
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
              Let us help you optimize your resume and land your dream job
            </Text>
          </Box>

          <MotionBox
            w="full"
            p={{ base: 6, md: 8, lg: 10 }}
            borderWidth={1}
            borderRadius="xl"
            shadow="xl"
            bg={useColorModeValue('white', 'gray.800')}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{
              y: -5,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              transition: { duration: 0.2 }
            }}
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={{ base: 6, md: 8 }}>
                <FormControl isRequired>
                  <FormLabel fontSize={{ base: 'lg', md: 'xl' }}>Select Your Resume (PDF)</FormLabel>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    p={2}
                    border="2px dashed"
                    borderColor="gray.300"
                    _hover={{ borderColor: '#667eea' }}
                    h="auto"
                    py={4}
                    rounded="full"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize={{ base: 'lg', md: 'xl' }}>What job are you interested in?</FormLabel>
                  <Input
                    type="text"
                    value={jobInterest}
                    onChange={(e) => setJobInterest(e.target.value)}
                    placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
                    size="lg"
                    rounded="xl"
                    borderWidth={2}
                    _hover={{ borderColor: '#667eea' }}
                    _focus={{ borderColor: '#764ba2', boxShadow: '0 0 0 1px #764ba2' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize={{ base: 'lg', md: 'xl' }}>Tell us more about what you want to achieve</FormLabel>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your career goals, specific areas you want to improve in your resume, or any particular requirements..."
                    size="lg"
                    rounded="xl"
                    borderWidth={2}
                    _hover={{ borderColor: '#667eea' }}
                    _focus={{ borderColor: '#764ba2', boxShadow: '0 0 0 1px #764ba2' }}
                    minH="150px"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize={{ base: 'lg', md: 'xl' }}>Select Plan</FormLabel>
                  <RadioGroup onChange={setPlan} value={plan}>
                    <Stack direction="column" spacing={{ base: 4, md: 6 }}>
                      {services.map((service) => (
                        <MotionBox
                          key={service.value}
                          whileHover={{
                            y: -2,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            transition: { duration: 0.2 }
                          }}
                        >
                          <Box
                            p={{ base: 6, md: 8 }}
                            borderWidth={1}
                            borderRadius="xl"
                            borderColor={plan === service.value ? '#667eea' : 'gray.200'}
                            _hover={{ borderColor: '#667eea' }}
                            transition="all 0.2s"
                          >
                            <Radio value={service.value}>
                              <HStack spacing={4} flexWrap="wrap">
                                <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }}>{service.title}</Text>
                                <Text color="#667eea" fontSize={{ base: 'lg', md: 'xl' }}>${prices[service.value]}</Text>
                              </HStack>
                              <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.500" mt={2}>
                                {service.description}
                              </Text>
                            </Radio>
                          </Box>
                        </MotionBox>
                      ))}
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <Button
                  type="submit"
                  size={{ base: "md", md: "lg" }}
                  w="full"
                  rounded="full"
                  isLoading={isLoading}
                  loadingText="Uploading..."
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                    bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
                  }}
                  transition="all 0.2s"
                  mt={{ base: 4, md: 6 }}
                >
                  Upload and Pay ${prices[plan]}
                </Button>
              </VStack>
            </form>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  )
}