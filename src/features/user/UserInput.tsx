import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  error?: string;
}

const UserInput = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, icon, trailingIcon, error, name, type = "text", ...props },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1.5">
        {/* LABEL */}
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>

        {/* INPUT WRAPPER */}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className={`
              w-full h-12 rounded-lg border bg-white text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-300
              dark:bg-input-dark dark:text-white
              dark:border-border-dark
              ${icon ? "pl-10" : "pl-4"}
              ${trailingIcon ? "pr-10" : "pr-4"}
              ${error ? "border-red-500 focus:ring-red-300" : "border-gray-300"}
              disabled:opacity-60 disabled:cursor-not-allowed
            `}
            {...props}
          />

          {trailingIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {trailingIcon}
            </span>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <p id={`${name}-error`} className="text-xs text-red-500 mt-0.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);

UserInput.displayName = "UserInput";

export default UserInput;
