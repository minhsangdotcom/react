import "./loginForm.css";
import { ILoginRequest } from "../../types/Auth/ILoginRequest";
import { useState } from "react";

import { loginAsync } from "../../store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hook";

const loginPage = () => {
  const [form, setForm] = useState<ILoginRequest>({
    username: "",
    password: "",
  });
  const [isHidden, setHidden] = useState(true);

  const dispatch = useAppDispatch();
  const data = useAppSelector((store) => store.auth);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginAsync(form));
  };

  return (
    <div className="login-form-container p-5 max-sm:w-9/10 max-md:w-8/10 max-lg:w-5/10 max-xl:w-lg max-2xl:w-md">
      <h2 className="login-form-title">Login</h2>
      <form onSubmit={onSubmit}>
        <div className="login-form-group">
          <label htmlFor="email">Username</label>
          <input
            name="username"
            type="text"
            value={form.username}
            className="login-form-input"
            onChange={onChange}
            required
          />
        </div>

        <div className="login-form-group">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type={isHidden ? "password" : "text"}
            className="login-form-input"
            value={form.password}
            onChange={onChange}
            required
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
        <button type="submit" className="login-form-button">
          Sign In
        </button>
        {data.error?.en && <span className="error">{data.error?.en}</span>}
      </form>
    </div>
  );
};

export default loginPage;
