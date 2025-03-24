import axios from 'axios';
import { create } from 'middleware-axios';
import config from '../../config.js';

/**
 * Axios middleware to attach Axios instance to request object.
 *
 * @param {object} req - The Express request object.
 * @param {object} _res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
export const axiosMiddleware = (req, _res, next) => {

  const protocol = config.API.PROTOCOL;
  const host = config.API.HOST
  const version = config.API.VERSION
  const baseURL = `${protocol}://${host}/${version}`;

  req.axiosMiddleware = create({
    axiosInstance: axios,
    baseURL: baseURL,
    timeout: 5000, 
    headers: {
      'Content-Type': 'application/json',
    },
  });

  req.axiosMiddleware.axiosInstance.interceptors.request.use((config) => {
    console.log('API request made to ', config.method.toUpperCase(), config.url);
    return config;
  }, (error) => {
    console.error('API request Error:', error);
    return Promise.reject(error);
  });

  req.axiosMiddleware.axiosInstance.interceptors.response.use((response) => {
    console.log('API response Status:', response.status);
    return response;
  }, (error) => {
    console.error('API response Error:', error);
    return Promise.reject(error);
  });

  next();
};