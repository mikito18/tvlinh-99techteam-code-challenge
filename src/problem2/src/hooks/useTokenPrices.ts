import { useQuery } from "@tanstack/react-query";
import { tokenPriceService } from "../services";
import { queryKeys } from "./query-keys";

export function useTokenPrices() {
  return useQuery({
    queryKey: queryKeys.tokenPrices(),
    queryFn: () => tokenPriceService.fetchTokenPrices(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    refetchOnWindowFocus: true,
  });
}

export function useAllTokensFromAPI() {
  return useQuery({
    queryKey: queryKeys.allTokens(),
    queryFn: () => tokenPriceService.getAllTokensFromAPI(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchOnWindowFocus: true,
  });
}

export function useTokenPrice(symbol: string) {
  return useQuery({
    queryKey: queryKeys.tokenPrice(symbol),
    queryFn: () => tokenPriceService.getTokenPrice(symbol),
    enabled: Boolean(symbol),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useTokenUSDValue(symbol: string, amount: string) {
  return useQuery({
    queryKey: queryKeys.tokenUSDValue(symbol, amount),
    queryFn: () => tokenPriceService.getUSDValue(symbol, amount),
    enabled: Boolean(symbol && amount && parseFloat(amount) > 0),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useExchangeRate(fromToken: string, toToken: string) {
  return useQuery({
    queryKey: queryKeys.exchangeRate(fromToken, toToken),
    queryFn: () => tokenPriceService.calculateExchangeRate(fromToken, toToken),
    enabled: Boolean(fromToken && toToken && fromToken !== toToken),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useAvailableTokens() {
  return useQuery({
    queryKey: queryKeys.availableTokens(),
    queryFn: () => tokenPriceService.getAvailableTokens(),
    staleTime: 5 * 60 * 1000, // 5 minutes - this data changes less frequently
    refetchInterval: 5 * 60 * 1000,
  });
}

export const useTokenPricesFromAPI = useTokenPrices;
