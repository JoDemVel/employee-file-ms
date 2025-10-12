import axios, { type AxiosInstance } from 'axios';
import type { ApiError, RequestConfig } from './types/api.types';

class HttpClient {
  private instance: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:8080/api') {
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

        const companyId = localStorage.getItem('company_id');

        if (companyId) {
          config.headers['X-Company-Id'] = companyId;
        }

        return config;
      },
      (error) => {
        console.error('Request Interceptor Error:', error);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const apiError: ApiError = {
          message:
            error.response?.data?.message ||
            error.message ||
            'An unknown error occurred',
          status: error.response?.status,
          errors: error.response?.data?.errors,
        };

        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('company_id');
          window.location.href = '/login';
        }

        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    if (response.data && typeof response.data !== 'undefined') {
      return response.data as T;
    }
    throw new Error('Response data is missing');
  }

  async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    if (typeof response.data !== 'undefined') {
      return response.data as T;
    }
    throw new Error('Response data is missing');
  }

  async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    if (typeof response.data !== 'undefined') {
      return response.data as T;
    }
    throw new Error('Response data is missing');
  }

  async patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    if (typeof response.data !== 'undefined') {
      return response.data as T;
    }
    throw new Error('Response data is missing');
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    if (typeof response.data !== 'undefined') {
      return response.data as T;
    }
    throw new Error('Response data is missing');
  }
}

export const httpClient = new HttpClient();
