import { forwardRef, InputHTMLAttributes } from "react";
import "./input.css";

interface NormalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type: string;
  inputName: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, NormalInputProps>(
  ({ label, type, inputName, error, id, className, ...props }, ref) => {
    const inputId = id ?? inputName;

    return (
      <div className="form-group">
        <label htmlFor={inputId}>{label}</label>

        <input
          ref={ref}
          id={inputId}
          name={inputName}
          type={type}
          className={`${className ?? "form-input"} ${
            error ? "form-input-error" : ""
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />

        {error && (
          <p id={`${inputId}-error`} className="form-error-text">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "NormalInput";

export default Input;
