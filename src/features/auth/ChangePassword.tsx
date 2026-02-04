import LoadingButton from "@/components/LoadingButton";
import PasswordInput from "@/components/PasswordInput";
import {
  changePasswordSchema,
  ChangePasswordSchemaType,
} from "./changePasswordSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import authService from "./authService";
import { useState } from "react";
import { showSuccessToast } from "@/notifications/toastSuccess";
import { useAppDispatch } from "@/store/hook";
import { logout } from "./authSlice";
import { TRANSLATION_KEYS } from "@/config/translationKey";
import { useTranslation } from "react-i18next";

export function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  async function submit(data: ChangePasswordSchemaType) {
    setLoading(true);
    const result = await authService.changePassword({
      oldPassword: data.oldPassword,
      newPassword: data.password,
    });

    if (result.success) {
      showSuccessToast("Update password success!");
      dispatch(logout());
    }
    setLoading(false);
  }
  return (
    <div className="flex justify-center items-center px-3 py-10 h-auto">
      <form
        className="w-full md:w-md rounded-xl bg-background p-6 shadow-lg border border-border"
        onSubmit={handleSubmit(submit)}
      >
        <h2 className="text-xl font-semibold mb-2">
          {t(TRANSLATION_KEYS.changePassword.title)}
        </h2>

        <PasswordInput
          label={t(TRANSLATION_KEYS.changePassword.form.currentPassword)}
          {...register("oldPassword")}
          error={t(errors.oldPassword?.message as any)}
        />

        <PasswordInput
          label={t(TRANSLATION_KEYS.changePassword.form.newPassword)}
          {...register("password")}
          error={t(errors.password?.message as any)}
        />

        <PasswordInput
          label={t(TRANSLATION_KEYS.changePassword.form.confirmPassword)}
          {...register("confirmPassword")}
          error={t(errors.confirmPassword?.message as any)}
        />

        <LoadingButton
          loading={loading}
          text={t(TRANSLATION_KEYS.common.actions.save)}
          type="submit"
        />
      </form>
    </div>
  );
}
