import "@features/auth/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import Input from "@/components/Input";
import LoadingButton from "@components/LoadingButton";
import { loginAsync } from "@features/auth/authAction";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, loginSchemaType } from "./loginSchema";
import PasswordInput from "@/components/PasswordInput";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEYS } from "@/config/translationKey";

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
  const { t } = useTranslation();

  async function onSubmit(formData: loginSchemaType) {
    try {
      await dispatch(
        loginAsync({
          identifier: formData.identifier,
          password: formData.password,
        })
      ).unwrap();

      navigate("/");
    } catch {
      //
    }
  }

  return (
    <div className="login-form-container p-5 w-full md:w-md my-20 md:my-10">
      <h2 className="login-form-title">{t(TRANSLATION_KEYS.login.title)}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label={t(TRANSLATION_KEYS.login.form.identifier)}
          type="text"
          inputName="identifier"
          error={errors.identifier?.message}
          autoComplete={t(TRANSLATION_KEYS.login.form.identifier)}
          {...register("identifier")}
        />

        <PasswordInput
          label={t(TRANSLATION_KEYS.login.form.password)}
          {...register("password")}
          error={errors.password?.message}
        />

        <LoadingButton
          loading={data.isLoading}
          text={t(TRANSLATION_KEYS.login.button.signin)}
          type="submit"
          className="w-full p-3 text-base font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover rounded cursor-pointer mb-1.25 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <Link to={"/forgot-password"} className="text-600 forget-password-text">
          {t(TRANSLATION_KEYS.login.link.forgotPassword)}
        </Link>
      </form>
    </div>
  );
}
