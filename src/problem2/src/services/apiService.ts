import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
}

class ApiService {
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;

    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private setupRequestInterceptor(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Log request in development
        if (import.meta.env.DEV) {
          console.log(
            `🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`,
            {
              data: config.data,
              params: config.params,
            }
          );
        }

        return config;
      },
      (error: AxiosError) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
      }
    );
  }

  private setupResponseInterceptor(): void {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response in development
        if (import.meta.env.DEV) {
          console.log(
            `✅ [API Response] ${response.config.method?.toUpperCase()} ${
              response.config.url
            }`,
            {
              status: response.status,
              data: response.data,
            }
          );
        }

        return response;
      },
      (error: AxiosError<ApiErrorResponse>) => {
        // Handle global errors
        this.handleGlobalError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleGlobalError(error: AxiosError<ApiErrorResponse>): void {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    console.error(`❌ [API Error] ${status}: ${message}`);

    // Handle specific error cases
    switch (status) {
      case 403:
        // Forbidden
        console.warn("🚫 Access forbidden");
        break;
      case 404:
        // Not found
        console.warn("🔍 Resource not found");
        break;
      case 500:
        // Server error
        console.error("💥 Internal server error");
        break;
      default:
        console.error("🔧 Unknown error occurred");
    }
  }

  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return this.transformResponse(response);
    } catch (error) {
      throw this.transformError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return this.transformResponse(response);
    } catch (error) {
      throw this.transformError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return this.transformResponse(response);
    } catch (error) {
      throw this.transformError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      return this.transformResponse(response);
    } catch (error) {
      throw this.transformError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return this.transformResponse(response);
    } catch (error) {
      throw this.transformError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async upload<T = any>(
    url: string,
    file: File,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await this.axiosInstance.post<T>(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      });
      return this.transformResponse(response);
    } catch (error) {
      throw this.transformError(error as AxiosError<ApiErrorResponse>);
    }
  }

  private transformResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      success: true,
      status: response.status,
      message: response.statusText,
    };
  }

  private transformError(error: AxiosError<ApiErrorResponse>): Error {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    const customError = new Error(message);

    // Add additional info
    (customError as any).status = error.response?.status;
    (customError as any).code = error.code;
    (customError as any).response = error.response?.data;

    return customError;
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  updateBaseURL(newBaseURL: string): void {
    this.baseURL = newBaseURL;
    this.axiosInstance.defaults.baseURL = newBaseURL;
  }
}

export { ApiService, type ApiConfig, type ApiResponse, type ApiErrorResponse };
