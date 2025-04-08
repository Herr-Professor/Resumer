import { useState, useCallback } from 'react'
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
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Collapse
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const MotionBox = motion(Box)

// Define allowed MIME types
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [jobInterest, setJobInterest] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const toast = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setUploadResult(null);
    setUploadError(null);
    if (file && ALLOWED_MIME_TYPES.includes(file.type)) {
      setSelectedFile(file)
    } else if (file) {
      event.target.value = null;
      setSelectedFile(null);
      toast({
        title: 'Invalid file type',
        description: `Please upload a file with one of the following extensions: ${ALLOWED_EXTENSIONS.join(', ')}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } else {
      setSelectedFile(null);
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

    setIsLoading(true)
    setUploadProgress(0);
    setUploadResult(null);
    setUploadError(null);
    const formData = new FormData()
    formData.append('resume', selectedFile)
    formData.append('jobInterest', jobInterest)
    formData.append('description', description)

    const token = localStorage.getItem('token')
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      }
    };

    try {
      const response = await axios.post(API_ENDPOINTS.resumes.base, formData, config); 
      
      toast({
        title: 'Upload & Basic Check Successful',
        description: 'Your resume was uploaded and initial analysis is complete.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setUploadResult(response.data); 
      setSelectedFile(null);
      document.getElementById('resume-upload-input').value = null;

    } catch (error) {
      const errorMsg = error.response?.data?.error || 'An error occurred during upload.';
      const errorDetails = error.response?.data?.details;
      setUploadError(errorDetails ? `${errorMsg}: ${errorDetails}` : errorMsg);
      toast({
        title: 'Upload Failed',
        description: errorMsg,
        status: 'error',
        duration: 7000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
      setUploadProgress(0);
    }
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
                  <FormLabel fontSize={{ base: 'lg', md: 'xl' }}>Select Your Resume ({ALLOWED_EXTENSIONS.join(', ')})</FormLabel>
                  <Input
                    id="resume-upload-input"
                    type="file"
                    accept={ALLOWED_EXTENSIONS.join(',')}
                    onChange={handleFileChange}
                    p={2}
                    border="2px dashed"
                    borderColor={selectedFile ? 'green.300' : 'gray.300'}
                    _hover={{ borderColor: '#667eea' }}
                    h="auto"
                    py={4}
                  />
                  {selectedFile && (
                    <Text fontSize="sm" color="gray.500" mt={2}>Selected: {selectedFile.name}</Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel fontSize={{ base: 'lg', md: 'xl' }}>Target Job Title (Optional)</FormLabel>
                  <Input
                    type="text"
                    placeholder="e.g., Software Engineer, Project Manager"
                    value={jobInterest}
                    onChange={(e) => setJobInterest(e.target.value)}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>Helps provide context, especially if requesting optimization later.</Text>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize={{ base: 'lg', md: 'xl' }}>Brief Description (Optional)</FormLabel>
                  <Textarea
                    placeholder="Any specific goals or notes for your resume? (e.g., changing careers, targeting specific industry)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </FormControl>

                {isLoading && (
                  <Progress 
                    hasStripe 
                    isAnimated 
                    value={uploadProgress} 
                    width="100%" 
                    size="sm" 
                    colorScheme="purple" 
                    borderRadius="md"
                  />
                )}

                <Button 
                  type="submit" 
                  isLoading={isLoading}
                  loadingText={uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Uploading...'}
                  colorScheme="purple"
                  bgGradient="linear(to-r, #667eea, #764ba2)"
                  color="white"
                  _hover={{ 
                    bgGradient: "linear(to-r, #764ba2, #667eea)",
                    shadow: "md"
                  }}
                  size="lg"
                  w="full"
                  isDisabled={!selectedFile}
                >
                  Upload & Run Basic ATS Check
                </Button>
              </VStack>
            </form>
          </MotionBox>

          <Collapse in={uploadResult || uploadError} animateOpacity>
             <MotionBox
                mt={8}
                p={5}
                borderWidth={1}
                borderRadius="lg"
                shadow="md"
                bg={uploadError ? useColorModeValue('red.50', 'red.900') : useColorModeValue('green.50', 'green.900')}
                borderColor={uploadError ? 'red.200' : 'green.200'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
             >
               {uploadError ? (
                  <Alert status='error' variant='subtle' flexDirection='column' alignItems='center' justifyContent='center' textAlign='center'>
                    <AlertIcon boxSize='40px' mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize='lg'>Upload Failed</AlertTitle>
                    <AlertDescription maxWidth='sm'>{uploadError}</AlertDescription>
                    <CloseButton alignSelf='flex-start' position='relative' right={-1} top={-1} onClick={() => setUploadError(null)} />
                  </Alert>
               ) : uploadResult && (
                  <Box>
                    <Heading size="md" mb={3} color={useColorModeValue('green.700', 'green.200')}>Basic ATS Check Results</Heading>
                    <Text mb={2}><strong>Overall Score:</strong> {uploadResult.atsScore} / 100</Text>
                    <Text mb={1}><strong>Feedback:</strong></Text>
                    <VStack align="start" spacing={1} pl={4}>
                      {uploadResult.feedback?.map((item, index) => (
                        <HStack key={index}>
                           <Box as={item.type === 'positive' ? 'span' : 'span'} color={item.type === 'positive' ? 'green.500' : 'orange.500'}>●</Box> 
                           <Text fontSize="sm">{item.message}</Text>
                        </HStack>
                      )) || <Text fontSize="sm">No specific feedback generated.</Text>}
                    </VStack>
                    <Button mt={4} size="sm" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
                     <CloseButton position='absolute' right='8px' top='8px' onClick={() => setUploadResult(null)} />
                  </Box>
               )}
             </MotionBox>
          </Collapse>

        </VStack>
      </Container>
    </Box>
  )
}