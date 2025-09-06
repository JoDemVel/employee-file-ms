import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { ApiError, ApiResponse, RequestConfig } from './types/api.types';

class HttpClient {
  private instance: AxiosInstance;

  constructor(baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:3000/api') {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An unknown error occurred',
          status: error.response?.status,
          errors: error.response?.data?.errors,
        };

        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }

        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    if (response.data && typeof response.data.data !== 'undefined') {
      return response.data.data as T;
    }
    throw new Error('Response data is missing');
  }

  async post<T, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    if (typeof response.data.data !== 'undefined') {
      return response.data.data as T;
    }
    throw new Error('Response data is missing');
  }

  async put<T, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    if (typeof response.data.data !== 'undefined') {
      return response.data.data as T;
    }
    throw new Error('Response data is missing');
  }

  async patch<T, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    if (typeof response.data.data !== 'undefined') {
      return response.data.data as T;
    }
    throw new Error('Response data is missing');
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    if (typeof response.data.data !== 'undefined') {
      return response.data.data as T;
    }
    throw new Error('Response data is missing');
  }
}

export const httpClient = new HttpClient();