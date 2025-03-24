import axios from 'axios';
import config from '../../config.js';

// Construct the base URL from configuration
const baseURL = `${config.API.PROTOCOL}://${config.API.HOST}/${config.API.VERSION}`;

// Create a pre-configured axios instance
const apiClient = axios.create({
    baseURL,
    timeout: 5000, // Set a timeout value if needed
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(
    (config) => {
        console.log('API request made to:', config.url);
        return config;
    },
    (error) => {
        console.error('API request error:', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        console.log('API response status:', response.status);
        return response;
    },
    (error) => {
        console.error('API response error:', error);
        return Promise.reject(error);
    }
);

export default apiClient;