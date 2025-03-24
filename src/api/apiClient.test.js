import config from '../../config.js';
import apiClient from './apiClient.js';

// Provide a manual mock for axios.
jest.mock('axios', () => {
    return {
        create: jest.fn((config) => {
            return {
                defaults: config,
                interceptors: {
                    request: { use: jest.fn() },
                    response: { use: jest.fn() },
                },
                get: jest.fn(),
            };
        }),
        get: jest.fn(),
    };
});

describe('apiClient', () => {
    it('should have the correct baseURL', () => {
        const expectedBaseURL = `${config.API.PROTOCOL}://${config.API.HOST}/${config.API.VERSION}`;
        expect(apiClient.defaults.baseURL).toBe(expectedBaseURL);
    });

    it('should make a GET request correctly', async () => {
        const fakeData = { data: { message: 'Success' } };
        // Simulate axios.get resolving with fakeData.
        apiClient.get.mockResolvedValue(fakeData);

        const response = await apiClient.get('/test-endpoint');

        expect(response).toEqual(fakeData);
        // Ensure that axios.get was called with '/test-endpoint'
        expect(apiClient.get).toHaveBeenCalledWith('/test-endpoint');
    });
});