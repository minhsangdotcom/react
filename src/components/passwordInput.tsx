import { useState } from "react";
import "./password-input.css";

type PasswordInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string | undefined;
  label?: string;
  placeholder?: string;
  isRequired: boolean;
};

export default function PasswordInput(inputProps: PasswordInputProps) {
  const { name, value, onChange, placeholder, label, isRequired } = inputProps;
  const [isHidden, setHidden] = useState(true);
  return (
    <div className="form-group">
      <label htmlFor="password">{label}</label>
      <div className="password-wrapper">
        <input
          className="form-input"
          name={name}
          type={isHidden ? "password" : "text"}
          value={value}
          onChange={onChange}
          required={isRequired}
          placeholder={placeholder}
        />

        <button
          type="button"
          className={`password-toggle ${!isHidden ? "active" : ""}`}
          onClick={() => setHidden(!isHidden)}
          aria-label={isHidden ? "Show password" : "Hide password"}
        >
          <img
            src={
              isHidden
                ? "/icons/eye-closed.png"
                : "/icons/eye.png"
            }
            alt=""
          />
        </button>
      </div>
    </div>
  );
}
