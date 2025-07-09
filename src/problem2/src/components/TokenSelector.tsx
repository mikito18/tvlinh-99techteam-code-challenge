import { useState, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { type Token } from "~app/components/types";
import { Button, LoadingSpinner, Dropdown } from "~app/components/common";
import { TokenIcon } from "./TokenIcon";
import { CaretDownIcon } from "@phosphor-icons/react";
import { useAllTokensFromAPI } from "~app/hooks";
import { cn } from "~app/utils";
import { formatPrice } from "~app/helpers";

interface TokenSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TokenSelector({
  value,
  onChange,
  disabled,
}: TokenSelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fetch all tokens from API
  const {
    data: allTokens,
    isLoading: tokensLoading,
    error,
  } = useAllTokensFromAPI();

  // Filter tokens based on search query
  const filteredTokens =
    allTokens?.filter(
      (token) =>
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Find selected token
  const selectedToken = allTokens?.find((token) => token.symbol === value);

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleTokenSelect = (tokenSymbol: string) => {
    onChange(tokenSymbol);
    handleClose();
  };

  // Render dropdown content
  const renderTokenList = () => {
    if (tokensLoading) {
      return (
        <div className="px-3 py-4 text-center text-white/70">
          <LoadingSpinner size="sm" variant="dots" />
          <span className="text-sm mt-2 block">{t("token.loading")}</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="px-3 py-4 text-center text-red-300">
          <span className="text-sm">{t("token.error")}</span>
        </div>
      );
    }

    if (filteredTokens.length === 0) {
      return (
        <div className="px-3 py-4 text-center text-white/70">
          <span className="text-sm">
            {searchQuery ? t("token.notFound") : t("token.notFound")}
          </span>
        </div>
      );
    }

    return filteredTokens.map((token, index) => (
      <div
        key={token.symbol}
        onClick={() => handleTokenSelect(token.symbol)}
        className={cn(
          "w-full px-3 py-3 text-white hover:bg-teal-700 flex items-center justify-between transition-colors duration-150 cursor-pointer",
          index === 0 && !searchQuery && "rounded-t-lg",
          index === filteredTokens.length - 1 && "rounded-b-lg",
          value === token.symbol && "bg-teal-700"
        )}
      >
        <div className="flex items-center space-x-3">
          <TokenIcon symbol={token.symbol} size={20} />
          <div className="text-left">
            <div className="font-medium">{token.symbol}</div>
            <div className="text-xs text-white/70 max-w-32 truncate">
              {token.name}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">{formatPrice(token.price)}</div>
          <div className="text-xs text-white/70">{t("token.usd")}</div>
        </div>
      </div>
    ));
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        type="button"
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || tokensLoading}
        leftIcon={
          tokensLoading ? (
            <LoadingSpinner size="sm" variant="spinner" />
          ) : (
            <TokenIcon symbol={value} size={20} />
          )
        }
        rightIcon={
          <CaretDownIcon
            size={16}
            weight="regular"
            className={cn(
              "transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        }
        className="flex items-center space-x-2 transition-all duration-200 hover:scale-105"
      >
        {tokensLoading ? t("app.loading") : selectedToken?.symbol || value}
      </Button>

      <Dropdown
        isOpen={isOpen}
        onClose={handleClose}
        buttonRef={buttonRef}
        searchable={true}
        searchPlaceholder={t("token.search")}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        minWidth={320}
      >
        {renderTokenList()}
      </Dropdown>
    </div>
  );
}
