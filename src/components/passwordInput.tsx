import { forwardRef, InputHTMLAttributes, useState } from "react";
import "./password-input.css";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  inputClassName?: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, labelClassName, inputClassName, error, ...props }, ref) => {
    const [hidden, setHidden] = useState(true);
    return (
      <div className="form-group">
        {label && (
          <label htmlFor="password" className={labelClassName}>
            {label}
          </label>
        )}

        <div className="password-wrapper">
          <input
            ref={ref}
            className={inputClassName ?? "form-input"}
            type={hidden ? "password" : "text"}
            {...props}
            autoComplete="current-password"
          />

          <button
            type="button"
            className={`password-toggle ${!hidden ? "active" : ""}`}
            onClick={() => setHidden((prev) => !prev)}
            aria-label={hidden ? "Show password" : "Hide password"}
          >
            <img src={hidden ? "/icons/eye-closed.png" : "/icons/eye.png"} />
          </button>
        </div>
        {error && (
          <p id={`password-error`} className="form-error-text">
            {error}
          </p>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
