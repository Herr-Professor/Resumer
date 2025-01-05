export const API_URL = 'http://localhost:3000';
export const API_ENDPOINTS = {
  auth: {
    register: `${API_URL}/api/auth/register`,
    login: `${API_URL}/api/auth/login`,
  },
  resumes: {
    submit: `${API_URL}/api/resumes`,
    getUserSubmissions: (userId) => `${API_URL}/api/resumes/user/${userId}`,
    downloadOriginal: (id) => `${API_URL}/api/resumes/download-original/${id}`,
    downloadOptimized: (id) => `${API_URL}/api/resumes/download-optimized/${id}`,
  },
  admin: {
    getAllSubmissions: `${API_URL}/api/admin/submissions`,
    updateSubmission: (id) => `${API_URL}/api/admin/submissions/${id}`,
    downloadOriginal: (id) => `${API_URL}/api/admin/submissions/${id}/download-original`,
    downloadOptimized: (id) => `${API_URL}/api/admin/submissions/${id}/download-optimized`,
    stats: `${API_URL}/api/admin/stats`,
  },
  contact: {
    send: `${API_URL}/api/contact`,
  },
}; 