export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
export const API_ENDPOINTS = {
  auth: {
    register: `${API_URL}/api/auth/register`,
    login: `${API_URL}/api/auth/login`,
    getProfile: `${API_URL}/api/auth/profile`,
  },
  resumes: {
    submit: `${API_URL}/api/resumes`,
    freeAtsCheck: `${API_URL}/api/resumes/free-ats-check/`,
    getMySubmissions: `${API_URL}/api/resumes`,
    getSingleResume: (id) => `${API_URL}/api/resumes/${id}`,
    addJobDescription: (id) => `${API_URL}/api/resumes/${id}/job-description`,
    getResumeText: (id) => `${API_URL}/api/resumes/${id}/text`,
    saveResumeText: (id) => `${API_URL}/api/resumes/${id}/text`,
    detailedAtsReport: (id) => `${API_URL}/api/resumes/${id}/detailed-ats-report`,
    jobOptimization: (id) => `${API_URL}/api/resumes/${id}/job-optimization`,
    analyzeChanges: (id) => `${API_URL}/api/resumes/${id}/analyze-changes`,
    getUserReviews: `${API_URL}/api/resumes/reviews`,
    downloadAuthOriginal: (id) => `${API_URL}/api/resumes/${id}/download-original`,
    downloadAuthOptimized: (id) => `${API_URL}/api/resumes/${id}/download-optimized`,
  },
  payments: {
    createCheckout: `${API_URL}/api/payments/create-checkout-session`,
  },
  admin: {
    getAllSubmissions: `${API_URL}/api/admin/submissions`,
    updateSubmission: (id) => `${API_URL}/api/admin/submissions/${id}`,
    downloadOriginal: (id) => `${API_URL}/api/admin/submissions/${id}/download-original`,
    downloadOptimized: (id) => `${API_URL}/api/admin/submissions/${id}/download-optimized`,
    stats: `${API_URL}/api/admin/stats`,
    getAllReviews: `${API_URL}/api/admin/reviews`,
    updateReview: (id) => `${API_URL}/api/admin/reviews/${id}`,
  },
  contact: {
    send: `${API_URL}/api/contact`,
  },
}; 