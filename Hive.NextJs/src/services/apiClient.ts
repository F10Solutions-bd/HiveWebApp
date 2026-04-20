/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAccessToken } from '@/services/tokenManager';
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { getOrCreateKeyPair } from "@/lib/dpop/store";
import { createDPoPProof } from "@/lib/dpop/proof";

// --- Race Condition Prevention ---
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export interface ApiResponse<T> {
    message: string;
    data: T | null;
    isSuccess: boolean;
    errors: Record<string, string[]>;
}
interface ValidationProblemDetails {
    type: string;
    title: string;
    status: number;
    errors: Record<string, string[]>;
}

export const createApiClient = (): {
    get: <T>(
        url: string,
        config?: AxiosRequestConfig
    ) => Promise<ApiResponse<T>>;
    post: <T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ) => Promise<ApiResponse<T>>;
    put: <T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ) => Promise<ApiResponse<T>>;
    delete: <T>(
        url: string,
        config?: AxiosRequestConfig
    ) => Promise<ApiResponse<T>>;
    getRaw: (url: string, config?: AxiosRequestConfig) => Promise<any>;
} => {
    const instance: AxiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        withCredentials: true,
    });

    // Lazy-load token before each request
    instance.interceptors.request.use(async (config) => {

        const token = await getAccessToken();
        config.headers = config.headers ?? {};
        if (token) config.headers.Authorization = `Bearer ${token}`;

        // ==========================
        // 🔐 DPoP PROOF GENERATION
        // ==========================
        try {
            const keyPair = await getOrCreateKeyPair();
            const url = `${config.baseURL ?? ''}${config.url}`;
            const method = (config.method ?? 'GET').toUpperCase();
            
            const dpopProof = await createDPoPProof(method, url, keyPair);
            if (dpopProof) {
                config.headers.DPoP = dpopProof;
            }
        } catch (e) {
            console.error(e);
        }

        // If a refresh is already happening, don't send this request yet.
        // Wait for the 'winner' of the refresh race to finish.

        // if (isRefreshing) {
        //     const token = await refreshPromise;
        //     if (token) {
        //         config.headers.Authorization = `Bearer ${token}`;
        //     }
        // }

        return config;
    });

    // GLOBAL RESPONSE ERROR HANDLER
    instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
            const status = error.response?.status;
            const data = error.response?.data as any;

            // if (status === 401 && !originalRequest._retry) {
            //     originalRequest._retry = true;

            //     if (!isRefreshing) {
            //         isRefreshing = true;
            //         refreshPromise = getAccessToken().finally(() => {
            //             isRefreshing = false;
            //             refreshPromise = null;
            //         });
            //     }

            //     try {
            //         const newToken = await refreshPromise;


            //         if (newToken) {
            //             originalRequest.headers = originalRequest.headers ?? {};
            //             originalRequest.headers.Authorization = `Bearer ${newToken}`;
            //             return instance(originalRequest);
            //         }
            //     } catch (refreshError) {
            //         isRefreshing = false;
            //         refreshPromise = null;
            //         toast.error("Session expired. Please login again.");
            //         return Promise.reject(refreshError);
            //     }
            // }

            // FluentValidation / ModelState errors (400)
            if (status === 400 && data?.errors) {
                const validation = data as ValidationProblemDetails;

                Object.values(validation.errors)
                    .flat()
                    .forEach((msg) => {
                        toast.error(msg);// here you can do anything that you want
                    });
            }

            if (status === 401) {
                toast.error("Unauthorized. Please login again.");
            }

            if (status === 403) {
                toast.error("You do not have permission.");
            }

            //if (status && status >= 500) {
            //    toast.error("Server error. Please try again later.");
            //}

            // Keep the request in the error state so it goes to .catch() in the calling code.
            // Prevents Axios from treating this as a successful response.
            return Promise.reject(error);
        }
    );


    const wrap = <T>(promise: Promise<AxiosResponse<ApiResponse<T>>>) =>
        promise.then((res) => res.data);

    return {
        get: <T>(url: string, config?: AxiosRequestConfig) =>
            wrap<T>(instance.get<ApiResponse<T>>(url, config)),
        post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
            wrap<T>(instance.post<ApiResponse<T>>(url, data, config)),
        put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
            wrap<T>(instance.put<ApiResponse<T>>(url, data, config)),
        delete: <T>(url: string, config?: AxiosRequestConfig) =>
            wrap<T>(instance.delete<ApiResponse<T>>(url, config)),
        getRaw: (url: string, config?: AxiosRequestConfig) =>
            instance.get(url, config),
    };
};

const api = createApiClient();
export default api;