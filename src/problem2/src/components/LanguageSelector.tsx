import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dropdown } from "~app/components/common";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "~app/utils";

const LANGUAGES = [
  { code: "en", name: "language.english", flag: "🇺🇸" },
  { code: "vi", name: "language.vietnamese", flag: "🇻🇳" },
] as const;

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentLanguage = LANGUAGES.find((lang) => lang.code === i18n.language);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        leftIcon={<span className="text-lg">{currentLanguage?.flag}</span>}
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
        {t(currentLanguage?.name || "language.english")}
      </Button>

      <Dropdown
        isOpen={isOpen}
        onClose={handleClose}
        buttonRef={buttonRef}
        minWidth={180}
        className="py-1"
      >
        {LANGUAGES.map((language) => (
          <div
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={cn(
              "w-full px-3 py-2 text-white hover:bg-teal-700 flex items-center space-x-3 transition-colors duration-150 text-left cursor-pointer",
              i18n.language === language.code && "bg-teal-700"
            )}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="font-medium">{t(language.name)}</span>
          </div>
        ))}
      </Dropdown>
    </div>
  );
}
