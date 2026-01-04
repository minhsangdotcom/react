import "@features/auth/login.css";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { ILoginRequest } from "@features/auth/ILoginRequest";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import NormalInput from "@components/NormalInput";
import PasswordInput from "@components/PasswordInput";
import LoadingButton from "@components/LoadingButton";
import { loginAsync } from "@features/auth/authAction";

export default function Login() {
  const [form, setForm] = useState<ILoginRequest>({
    identifier: "chloe.kim",
    password: "Admin@123",
  });
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const data = useAppSelector((store) => store.auth);

  const isLoading = data.isLoading;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    try {
      await dispatch(loginAsync(form)).unwrap();
      navigate("/");
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
    }
  };

  return (
    <div className="display-flex items-center justify-items-center h-screen">
      <div className="login-form-container p-5 mt-20 w-full sm:w-2/3 lg:w-1/3 xl:max-w-lg">
        <h2 className="login-form-title">Login</h2>
        <form onSubmit={onSubmit}>
          <NormalInput
            type="text"
            value={form.identifier}
            isRequired={true}
            label="Username or email"
            name="identifier"
            onChange={onChange}
          />

          <PasswordInput
            value={form.password}
            isRequired={true}
            label="Password"
            name="password"
            onChange={onChange}
          />

          <LoadingButton
            loading={isLoading}
            text="Sign In"
            type="submit"
            className="w-full p-3 text-base font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover rounded cursor-pointer mb-[5px] disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <Link
            to={"/forgot-password"}
            className="text-600 forget-password-text"
          >
            Forget password
          </Link>
          {data.error?.en && <p className="error">* {data.error?.en}</p>}
        </form>
      </div>
    </div>
  );
}
