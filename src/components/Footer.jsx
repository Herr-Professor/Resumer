import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  useColorModeValue,
  Icon,
  Button,
  Input,
  VStack,
  HStack
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Link = ({ href, children, isExternal = false }) => {
  if (isExternal) {
    return (
      <Text
        as="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        _hover={{ color: '#667eea' }}
        cursor="pointer"
      >
        {children}
      </Text>
    );
  }
  return (
    <Text
      as={RouterLink}
      to={href}
      _hover={{ color: '#667eea' }}
      cursor="pointer"
    >
      {children}
    </Text>
  );
};

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      borderTop="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      mt="auto"
    >
      <Container as={Stack} maxW="6xl" py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 2fr' }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Box>
              <Text
                fontSize="xl"
                fontWeight="bold"
                bgGradient="linear(to-r, #667eea, #764ba2)"
                bgClip="text"
              >
                ResumeOptimizer
              </Text>
            </Box>
            <Text fontSize="sm">
              © {new Date().getFullYear()} ResumeOptimizer. All rights reserved
            </Text>
            <Stack direction="row" spacing={6}>
              <Link href="https://twitter.com" isExternal>
                <Icon as={FaTwitter} w={6} h={6} _hover={{ color: '#1DA1F2' }} />
              </Link>
              <Link href="https://linkedin.com" isExternal>
                <Icon as={FaLinkedin} w={6} h={6} _hover={{ color: '#0077B5' }} />
              </Link>
            </Stack>
          </Stack>
          <Stack align="flex-start">
            <Text fontWeight="bold" fontSize="lg" mb={2}>Company</Text>
            <Link href="/about">About Us</Link>
            <Link href="/services">Services</Link>
          </Stack>
          <Stack align="flex-start">
            <Text fontWeight="bold" fontSize="lg" mb={2}>Legal</Text>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </Stack>
          <Stack align="flex-start">
            <Text fontWeight="bold" fontSize="lg" mb={2}>Stay up to date</Text>
            <Stack direction="row" width="full">
              <Input
                placeholder="Your email address"
                bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
                border={0}
                _focus={{
                  bg: 'whiteAlpha.300'
                }}
              />
              <Button
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
                _hover={{
                  bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
                }}
              >
                Subscribe
              </Button>
            </Stack>
            <HStack spacing={2} mt={2}>
              <Icon as={FaEnvelope} />
              <Text fontSize="sm">support@resumeoptimizer.io</Text>
            </HStack>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
} 