import { axiosMiddleware } from "./axiosSetup";

describe('axiosSetup middleware',  () => {

    let req, res, next;

    beforeEach(() => {
        req = { get: jest.fn(), protocol: 'http' }
        res = {}
        next = jest.fn(); 
    });

    it('should call next() after setting up axios when http', () => {
        req = { get: jest.fn(), protocol: 'http' }

        req.get.mockReturnValue('localhost');

        axiosMiddleware(req, res, next);

        // Ensure its setup the axios instance
        expect(req.axiosMiddleware).toBeDefined();
        expect(req.axiosMiddleware.axiosInstance).toBeDefined();

        // Ensure its setup the logging functions
        expect(req.axiosMiddleware.axiosInstance.interceptors.request).toBeDefined();
        expect(req.axiosMiddleware.axiosInstance.interceptors.response).toBeDefined();

        expect(next).toHaveBeenCalled();
    })

    it('should call next() after setting up axios when https', () => {
        req = { get: jest.fn(), protocol: 'https' }

        req.get.mockReturnValue('localhost');

        axiosMiddleware(req, res, next);

        expect(req.axiosMiddleware).toBeDefined();
        expect(req.axiosMiddleware.axiosInstance).toBeDefined();

        // Ensure its setup the logging functions
        expect(req.axiosMiddleware.axiosInstance.interceptors.request).toBeDefined();
        expect(req.axiosMiddleware.axiosInstance.interceptors.response).toBeDefined();

        expect(next).toHaveBeenCalled();
    })

})