import { ChakraProvider, extendTheme, Box } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Upload from './pages/Upload'
import Jobs from './pages/Jobs'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import AboutUs from './pages/AboutUs'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ResumeEditor from './pages/ResumeEditor'

// Custom theme with gradients
const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        fontSize: { base: '14px', md: '16px', lg: '16px' }
      },
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      }
    }
  },
  colors: {
    brand: {
      50: '#f0f4ff',
      100: '#d9e2ff',
      200: '#a6b9ff',
      300: '#7390ff',
      400: '#4067ff',
      500: '#1a3edb',
      600: '#0026b3',
      700: '#001c8c',
      800: '#001166',
      900: '#00073f'
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'lg',
      },
      sizes: {
        sm: {
          fontSize: { base: 'xs', md: 'sm' },
          px: { base: 3, md: 4 },
          py: { base: 1, md: 2 },
        },
        md: {
          fontSize: { base: 'sm', md: 'md' },
          px: { base: 4, md: 6 },
          py: { base: 2, md: 3 },
        },
        lg: {
          fontSize: { base: 'md', md: 'lg' },
          px: { base: 6, md: 8 },
          py: { base: 3, md: 4 },
        },
      },
    },
    Container: {
      baseStyle: {
        maxW: { base: '100%', sm: '540px', md: '768px', lg: '960px', xl: '1200px', '2xl': '1400px' },
        px: { base: 4, md: 6, lg: 8 },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        lineHeight: 'shorter',
      },
      sizes: {
        sm: {
          fontSize: { base: 'lg', md: 'xl' },
        },
        md: {
          fontSize: { base: 'xl', md: '2xl' },
        },
        lg: {
          fontSize: { base: '2xl', md: '3xl' },
        },
        xl: {
          fontSize: { base: '3xl', md: '4xl' },
        },
        '2xl': {
          fontSize: { base: '4xl', md: '5xl' },
        },
      },
    },
    Text: {
      baseStyle: {
        fontSize: { base: 'sm', md: 'md' },
      },
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  // Redirect admin users from regular dashboard to admin dashboard
  if (!adminOnly && user.role === 'admin' && window.location.pathname === '/dashboard') {
    return <Navigate to="/admin" />;
  }

  return children;
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Box display="flex" flexDirection="column" minHeight="100vh">
            <Navbar />
            <Box flex="1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/jobs" element={<Jobs/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route
                  path="/upload"
                  element={
                    <ProtectedRoute>
                      <Upload />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resume-editor/:id"
                  element={
                    <ProtectedRoute>
                      <ResumeEditor />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
