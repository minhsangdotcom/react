import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import authService from "@features/auth/authService";

import LoadingButton from "@components/LoadingButton";
import PasswordInput from "@/components/PasswordInput";
import {
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from "./resetPasswordSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEYS } from "@/config/translationKey";

export default function ResetPassword() {
  const [search] = useSearchParams();
  const token = search.get("token") ?? "";
  const email = search.get("email") ?? "";

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const submit = async (data: ResetPasswordSchemaType) => {
    setLoading(true);
    await authService.resetPassword({
      token,
      password: data.password,
      email,
    });
    setLoading(false);
  };

  return (
    <div className="w-full md:w-md my-20 md:my-10">
      <form
        onSubmit={handleSubmit(submit)}
        className="rounded-lg shadow p-5 h-auto"
      >
        <h2 className="text-xl font-semibold mb-2">
          {t(TRANSLATION_KEYS.resetPassword.title)}
        </h2>

        <PasswordInput
          label={t(TRANSLATION_KEYS.resetPassword.form.newPassword)}
          {...register("password")}
          error={t(errors.password?.message as any)}
        />

        <PasswordInput
          label={t(TRANSLATION_KEYS.resetPassword.form.confirmPassword)}
          {...register("confirmPassword")}
          error={t(errors.confirmPassword?.message as any)}
        />

        <LoadingButton
          loading={loading}
          text={t(TRANSLATION_KEYS.resetPassword.button.send)}
          type="submit"
        />
      </form>
    </div>
  );
}
