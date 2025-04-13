import {
  Box,
  Flex,
  Button,
  Stack,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  Image, // <-- Import Image component
  HStack, // <-- Import HStack for logo + text layout
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const logoPath = '/egg.png'; // Path to logo in public folder

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      px={4}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={1000}
      borderBottom="1px" // Optional: Add a subtle border like in the design
      borderColor={useColorModeValue('gray.200', 'gray.700')} // Optional border color
    >
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="container.xl" mx="auto"> {/* Added maxW and mx */}
        {/* Logo and Brand Name */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <HStack spacing={2} alignItems="center">
            <Image
              src={logoPath}
              alt="Resume Optimizer Logo"
              boxSize="35px"
              objectFit="contain"
            />
            <Text
              fontWeight="bold"
              fontSize="xl"
              bgGradient="linear(to-r, #667eea, #764ba2)"
              bgClip="text"
            >
              Resume Optimizer
            </Text>
          </HStack>
        </Link>

        {/* Navigation Links and Auth Buttons */}
        <Flex alignItems="center">
          <Stack direction="row" spacing={4} align="center">
            {/* Navigation Links */}
            <Link to="/services">
              <Button variant="ghost" fontWeight="medium">
                Services
              </Button>
            </Link>
            <Link to="/jobs"> 
              <Button variant="ghost" fontWeight="medium">
                Jobs
              </Button>
            </Link>

            {/* Conditional Auth Section */}
            {user ? (
              <>
                
                <Link to="/upload">
                  <Button
                    size="sm" 
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    color="white"
                    _hover={{
                      bg: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      boxShadow: 'md'
                    }}
                    rounded="md"
                  >
                    Upload Resume
                  </Button>
                </Link>
                {/* User Menu */}
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded="full"
                    variant="link"
                    cursor="pointer"
                    minW={0}
                  >
                    <Avatar
                      size="sm"
                      name={user.name || 'User'} 
                      // Optional: Use a simpler background or keep gradient
                      // bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      // color="white"
                      bg="purple.500"
                      color="white"
                    />
                  </MenuButton>
                  <MenuList>
                    {/* User Name Display */}
                    <Text px={3} py={2} fontWeight="bold" borderBottom="1px" borderColor={useColorModeValue('gray.200', 'gray.700')} mb={1}>
                      {user.name || 'User'}
                    </Text>
                    {/* Dashboard Links */}
                    {user.role === 'admin' ? (
                      <Link to="/admin">
                        <MenuItem>Admin Dashboard</MenuItem>
                      </Link>
                    ) : (
                      <Link to="/dashboard">
                        <MenuItem>Dashboard</MenuItem>
                      </Link>
                    )}
                    {/* Logout */}
                    <MenuItem onClick={handleLogout} color="red.500">Logout</MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                {/* Login and Sign Up Buttons */}
                <Link to="/login">
                   <Button variant="ghost" fontWeight="medium">Login</Button> {/* Match style */}
                 </Link>
                 <Link to="/register">
                   <Button
                    size="sm" // Smaller button like design
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    color="white"
                    _hover={{
                      bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                      boxShadow: 'md'
                    }}
                    rounded="md" // Match button style in design
                    px={4} // Adjust padding if needed
                   >
                     Sign Up
                   </Button>
                 </Link>
              </>
            )}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
