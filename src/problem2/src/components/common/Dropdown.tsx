import { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "~app/utils";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  children: ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
  maxHeight?: string;
  minWidth?: number;
  autoFocus?: boolean;
}

export function Dropdown({
  isOpen,
  onClose,
  buttonRef,
  children,
  searchable = false,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  className = "",
  maxHeight = "320px",
  minWidth = 320,
  autoFocus = true,
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = Math.max(buttonRect.width, minWidth);

      let left = buttonRect.left;
      let top = buttonRect.bottom + 4;

      if (left + dropdownWidth > window.innerWidth) {
        left = window.innerWidth - dropdownWidth - 16;
      }

      if (left < 16) {
        left = 16;
      }

      const maxDropdownHeight = Math.min(
        parseInt(maxHeight),
        window.innerHeight - 100
      );
      if (top + maxDropdownHeight > window.innerHeight - 20) {
        top = Math.max(20, buttonRect.top - maxDropdownHeight - 4);
      }

      setPosition({ top, left, width: dropdownWidth });
    }
  }, [isOpen, buttonRef, maxHeight, minWidth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleScroll = (event: Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll, true);
      document.addEventListener("keydown", handleKeyDown);
      window.addEventListener("resize", onClose);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", onClose);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  const dropdownContent = (
    <div
      ref={dropdownRef}
      className={cn(
        "cursor-pointer fixed bg-teal-600 rounded-lg shadow-xl border border-teal-500 animate-bounce-in z-[9999] flex flex-col",
        className
      )}
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        maxHeight: maxHeight,
      }}
    >
      {searchable && (
        <div className="flex-shrink-0 p-3 border-b border-teal-500">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full bg-teal-700 text-white placeholder-white/70 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            autoFocus={autoFocus}
          />
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {children}
      </div>
    </div>
  );

  return createPortal(dropdownContent, document.body);
}
