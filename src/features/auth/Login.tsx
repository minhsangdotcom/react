import "@features/auth/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import Input from "@/components/Input";
import PasswordInput from "@components/PasswordInput";
import LoadingButton from "@components/LoadingButton";
import { loginAsync } from "@features/auth/authAction";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, loginSchemaType } from "./loginSchema";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "chloe.kim",
      password: "Admin@123",
    },
  });
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const data = useAppSelector((store) => store.auth);

  async function onSubmit(data: loginSchemaType) {
    try {
      await dispatch(
        loginAsync({ identifier: data.identifier, password: data.password })
      ).unwrap();
      navigate("/");
    } catch (error) {
      //
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="login-form-container p-5 w-full md:w-md">
        <h2 className="login-form-title">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Username or email"
            type="text"
            inputName="identifier"
            error={errors.identifier?.message}
            autoComplete="username or email"
            {...register("identifier")}
          />

          <PasswordInput
            label="Password"
            {...register("password")}
            error={errors.password?.message}
          />

          <LoadingButton
            loading={data.isLoading}
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
          {/* {data.error?.en && <p className="error">* {data.error?.en}</p>} */}
        </form>
      </div>
    </div>
  );
}
