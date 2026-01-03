import { Search } from "lucide-react";
import { cn } from "@dscn/lib/utils";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className,
  inputClassName,
}: SearchBarProps) {
  return (
    <div className={cn("relative w-70", className)}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          `
          w-full rounded-lg border border-gray-300 bg-white
          px-3 py-2 pl-9 text-sm
          focus:outline-none focus:ring-brand-primary
        `,
          inputClassName,
        )}
      />

      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="h-4 w-4" />
      </span>
    </div>
  );
}
