import axios from 'axios';

// Create an API base URL from environment variables or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173/api';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common response scenarios
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (e.g., token expired)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tender API functions
export const tenderApi = {
  // Create a new tender
  createTender: async (tenderData) => {
    return apiClient.post('/tenders', tenderData);
  },
  
  // Get all tenders with optional filtering
  getTenders: async (filters = {}) => {
    return apiClient.get('/tenders', { params: filters });
  },
  
  // Get a single tender by ID
  getTenderById: async (id) => {
    return apiClient.get(`/tenders/${id}`);
  },
  
  // Update a tender
  updateTender: async (id, updateData) => {
    return apiClient.put(`/tenders/${id}`, updateData);
  },
  
  // Delete a tender
  deleteTender: async (id) => {
    return apiClient.delete(`/tenders/${id}`);
  },
  
  // Get tenders awaiting evaluation by specific evaluator
  getEvaluationTenders: async () => {
    return apiClient.get('/tenders/for-evaluation');
  },
  
  // Get open tenders that vendors can apply to
  getOpenTenders: async () => {
    return apiClient.get('/tenders/open');
  },
  
  // Get submissions for a specific tender
  getTenderSubmissions: async (tenderId: string) => {
    return apiClient.get(`/tenders/${tenderId}/submissions`);
  }
};

// Add evaluator API function
export const evaluatorApi = {
  getEvaluators: async () => apiClient.get('/evaluators'),
};

// Add submission API function
export const submissionApi = {
  getSubmissionById: async (id: string) => apiClient.get(`/submissions/${id}`),
};

export default apiClient;