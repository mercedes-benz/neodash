// api.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const BASE_URL = 'https://api.example.com'; // Replace with your API base URL

interface Api {
    get<T>(url: string, params?: object): Promise<AxiosResponse<T>>;
    post<T>(url: string, data?: object): Promise<AxiosResponse<T>>;
    put<T>(url: string, data?: object): Promise<AxiosResponse<T>>;
    delete<T>(url: string): Promise<AxiosResponse<T>>;
}

class ApiService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers you need
            },
        });
    }

    public get<T>(url: string, params?: object): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get(url, { params });
    }

    public post<T>(url: string, data?: object): Promise<AxiosResponse<T>> {
        return this.axiosInstance.post(url, data);
    }

    public put<T>(url: string, data?: object): Promise<AxiosResponse<T>> {
        return this.axiosInstance.put(url, data);
    }

    public delete<T>(url: string): Promise<AxiosResponse<T>> {
        return this.axiosInstance.delete(url);
    }
}

const api: Api = new ApiService();

export default api;
