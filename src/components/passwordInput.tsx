import { useState } from "react";
import "./passwordInput.css";

type PasswordInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string | undefined;
  label?: string;
  placeholder?: string;
  isRequired : boolean
};

export default function PasswordInput(inputProps: PasswordInputProps) {
  const { name, value, onChange, placeholder, label, isRequired } = inputProps;
  const [isHidden, setHidden] = useState(true);
  return (
    <div className="form-group">
      <label htmlFor="password">{label}</label>
      <input
        className="form-input"
        name={name}
        type={isHidden ? "password" : "text"}
        value={value}
        onChange={onChange}
        required = {isRequired}
        placeholder={placeholder}
      />

      <img
        className="show-password"
        src={
          isHidden
            ? "/icons/eye-password-hide.png"
            : "/icons/eye-password-show.png"
        }
        width={25}
        onClick={() => setHidden(!isHidden)}
      />
    </div>
  );
}
