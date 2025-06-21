import "./login.css";
import { ILoginRequest } from "../../../types/auth/ILoginRequest";
import { useState } from "react";

import { loginAsync } from "../../../store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import NormalInput from "../../../components/normalInput";
import PasswordInput from "../../../components/passwordInput";
import { Link } from "react-router-dom";

const loginPage = () => {
  const [form, setForm] = useState<ILoginRequest>({
    username: "",
    password: "",
  });

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
        <NormalInput
          type="text"
          value={form.username}
          isRequired={true}
          label="Username"
          name="username"
          onChange={onChange}
        />

        <PasswordInput
          value={form.password}
          isRequired={true}
          label="Password"
          name="password"
          onChange={onChange}
        />
        <button type="submit" className="login-form-button">
          Sign In
        </button>
        <Link to={"/forgot-password"} className="text-blue-600 forget-password-text">Forget password</Link>
        {data.error?.en && <span className="error">* {data.error?.en}</span>}
      </form>
    </div>
  );
};

export default loginPage;
