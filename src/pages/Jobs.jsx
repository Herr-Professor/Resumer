import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Stack,
  useColorModeValue,
  Spinner,
  Icon,
  HStack,
  VStack,
  Divider,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal, useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { API_ENDPOINTS } from '../config/api';
import _debounce from 'lodash/debounce';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedJob, setSelectedJob] = useState(null);

  // Styling hooks
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const getSalaryText = (job) => {
    if (!job?.salary_raw?.value) return 'Salary not specified';
    const salary = job.salary_raw.value;
    return `${salary.minValue}-${salary.maxValue} ${salary.unitText}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const fetchJobs = useCallback(async (keywords = '', location = '') => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        keywords,
        locationName: location,
      });

      const response = await fetch(`${API_ENDPOINTS.jobs.getJobs}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      if (responseText.startsWith("<!DOCTYPE html>")) {
        throw new Error("Service temporarily unavailable");
      }

      const data = JSON.parse(responseText);

      if (!Array.isArray(data)) {
        throw new Error("Unexpected job data format");
      }

      setJobs(data);

    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedApiCall = useCallback(
    _debounce((sTerm, lFilter) => {
      fetchJobs(sTerm, lFilter);
    }, 750),
    [fetchJobs]
  );

  useEffect(() => {
    debouncedApiCall(searchTerm, locationFilter);
  }, [searchTerm, locationFilter, debouncedApiCall]);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box bg={bgColor} minH="calc(100vh - 64px)">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={3} textAlign="center">
            <Heading as="h1" size="2xl" color={headingColor}>
              Job Opportunities
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="2xl">
              Browse the latest job postings from verified sources
            </Text>
          </VStack>

          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            p={4}
            bg={cardBg}
            rounded="lg"
            shadow="sm"
            border="1px"
            borderColor={cardBorder}
          >
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color={textColor} />
              </InputLeftElement>
              <Input
                placeholder="Search keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg={useColorModeValue('white', 'gray.700')}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaMapMarkerAlt} color={textColor} />
              </InputLeftElement>
              <Input
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                bg={useColorModeValue('white', 'gray.700')}
              />
            </InputGroup>
          </Stack>

          {error && (
            <Alert status="error" rounded="md">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Error Fetching Jobs!</AlertTitle>
                <AlertDescription display="block">
                  {error}
                </AlertDescription>
              </Box>
            </Alert>
          )}

          {loading ? (
            <Center h="40vh">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="purple.500"
                size="xl"
              />
            </Center>
          ) : (
            <Box>
              {!error && jobs.length === 0 ? (
                <Center h="30vh">
                  <Text color={textColor} fontSize="lg">
                    No jobs found matching your criteria
                  </Text>
                </Center>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {jobs.map((hit) => (
                    <Box
                      key={hit.id}
                      bg={cardBg}
                      p={6}
                      rounded="lg"
                      shadow="sm"
                      border="1px"
                      borderColor={cardBorder}
                      transition="all 0.2s ease-in-out"
                      _hover={{ shadow: 'md', transform: 'translateY(-4px)' }}
                    >
                      <VStack align="stretch" spacing={3}>
                        <Heading as="h3" size="md" color={headingColor} noOfLines={2}>
                          {hit.title}
                        </Heading>
                        <Text fontWeight="medium" color="purple.400">
                          {hit.organization || 'Company N/A'}
                        </Text>
                        <HStack spacing={2} color={textColor} fontSize="sm">
                          <Icon as={FaMapMarkerAlt} w={4} h={4} />
                          <Text>{hit.locations_derived?.join(', ') || 'Location N/A'}</Text>
                        </HStack>
                        <Text fontSize="sm" color={textColor}>
                          <strong>Salary:</strong> {getSalaryText(hit)}
                        </Text>
                        <Text fontSize="sm" color={textColor} noOfLines={4}>
                          {hit.description_text || 'Description not provided'}
                        </Text>
                        <Divider pt={2} />
                        <HStack justify="space-between" align="center" pt={1}>
                          <Text fontSize="xs" color={textColor}>
                            Posted: {formatDate(hit.date_posted)}
                          </Text>
                          <Button
                            size="sm"
                            colorScheme="purple"
                            onClick={() => {
                              setSelectedJob(hit);
                              onOpen();
                            }}
                          >
                            Details
                          </Button>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          )}
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedJob?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedJob && (
              <VStack align="start" spacing={4}>
                <Text>
                  <strong>Company:</strong> {selectedJob.organization || 'N/A'}
                </Text>
                <Text>
                  <strong>Location:</strong>{' '}
                  {selectedJob.locations_derived?.join(', ') || 'N/A'}
                </Text>
                <Text>
                  <strong>Posted:</strong> {formatDate(selectedJob.date_posted)}
                </Text>
                <Text>
                  <strong>Salary:</strong> {getSalaryText(selectedJob)}
                </Text>
                <Divider />
                <Text whiteSpace="pre-wrap">
                  {selectedJob.description_text || 'No description available'}
                </Text>
                {selectedJob.url && (
                  <Button
                    as="a"
                    href={selectedJob.url}
                    target="_blank"
                    colorScheme="purple"
                    rightIcon={<ExternalLinkIcon />}
                    w="full"
                    mt={4}
                  >
                    Apply Now
                  </Button>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
