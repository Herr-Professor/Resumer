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
  Text
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Link to="/">
          <Text
            fontWeight="bold"
            fontSize="xl"
            bgGradient="linear(to-r, #667eea, #764ba2)"
            bgClip="text"
          >
            ResumeOptimizer
          </Text>
        </Link>

        <Flex alignItems="center">
          <Stack direction="row" spacing={4} align="center">
            <Link to="/services">
              <Button variant="ghost">Services</Button>
            </Link>
            
            {user ? (
              <>
                <Link to="/upload">
                  <Button
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    color="white"
                    _hover={{
                      bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
                    }}
                  >
                    Upload Resume
                  </Button>
                </Link>
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
                      name={user.name}
                      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      color="white"
                    />
                  </MenuButton>
                  <MenuList>
                    <Text px={3} py={2} color="gray.500">
                      {user.name}
                    </Text>
                    {user.role === 'admin' ? (
                      <Link to="/admin">
                        <MenuItem>Admin Dashboard</MenuItem>
                      </Link>
                    ) : (
                      <Link to="/dashboard">
                        <MenuItem>Dashboard</MenuItem>
                      </Link>
                    )}
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    color="white"
                    _hover={{
                      bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
                    }}
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