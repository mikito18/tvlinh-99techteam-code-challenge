import { ApiService } from "./apiService";

// Tạo instance apiService mặc định
export const apiService = new ApiService({
  baseURL: "https://interview.switcheo.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export * from "./apiService";
export * from "./tokenPriceService";
export * from "./priceHistoryService";

export type { ApiConfig, ApiResponse, ApiErrorResponse } from "./apiService";
