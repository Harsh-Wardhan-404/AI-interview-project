import axios from "axios";
import config from "./config";

// Create axios instance for backend API
export const api = axios.create({
  baseURL: config.backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create axios instance for FastAPI
export const fastApi = axios.create({
  baseURL: config.fastApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// FastAPI error handling interceptor
fastApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("FastAPI Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Function to get ideal answer and analysis
export const getIdealAnswer = async (question, answer) => {
  try {
    const response = await fastApi.post('/get-ideal-answer', {
      question,
      answer
    });
    return response.data;
  } catch (error) {
    console.error('Error getting ideal answer:', error);
    throw error;
  }
};

// Function to handle file uploads to S3
export const uploadToS3 = async (file, questionIndex) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("questionIndex", questionIndex);

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        // You can use this to update a progress bar
        console.log(`Upload Progress: ${percentCompleted}%`);
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};

// Function to process audio/video
export const processMedia = async (file, questionIndex) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("questionIndex", questionIndex);

    const response = await fastApi.post("/process-audio", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error processing media:", error);
    throw error;
  }
};

// Function to analyze text
export const analyzeText = async (text) => {
  try {
    const response = await fastApi.post("/analyze-text", { text });
    return response.data;
  } catch (error) {
    console.error("Error analyzing text:", error);
    throw error;
  }
};

export default {
  api,
  fastApi,
  getIdealAnswer,
  uploadToS3,
  processMedia,
  analyzeText,
};