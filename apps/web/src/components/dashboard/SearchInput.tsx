import { type ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput = ({ value, onChange, placeholder = "Search...", className }: SearchInputProps) => (
  <div className={cn("relative", className)}>
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-subtle" aria-hidden="true" />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className="w-full h-9 pl-9 pr-3 rounded-lg border border-border-soft bg-surface-panel font-body text-body-sm text-text-strong placeholder:text-text-subtle/50 focus:outline-none focus:ring-1 focus:ring-text-strong/10 transition-shadow"
    />
  </div>
);

export default SearchInput;
