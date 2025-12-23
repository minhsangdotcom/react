import "./login.css";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { ILoginRequest } from "@/src/types/Auth/ILoginRequest";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import { loginAsync } from "@/src/store/auth/authSlice";
import NormalInput from "@/src/components/normalInput";
import PasswordInput from "@/src/components/passwordInput";
import LoadingButton from "@/src/components/loadingButton";

const loginPage = () => {
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
    <div className="login-form-container p-5 max-sm:w-9/10 max-md:w-8/10 max-lg:w-5/10 max-xl:w-lg max-2xl:w-md">
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

        <Link to={"/forgot-password"} className="text-600 forget-password-text">
          Forget password
        </Link>
        {data.error?.en && <p className="error">* {data.error?.en}</p>}
      </form>
    </div>
  );
};

export default loginPage;
