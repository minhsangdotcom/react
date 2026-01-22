import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import authService from "@features/auth/authService";

import LoadingButton from "@components/LoadingButton";
import PasswordInput from "@/components/PasswordInput";
import {
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from "./ResetPasswordSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ResetPassword() {
  const [search] = useSearchParams();
  const token = search.get("token") ?? "";
  const email = search.get("email") ?? "";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const submit = async (data: ResetPasswordSchemaType) => {
    setLoading(true);
    const result = await authService.resetPassword({
      token,
      password: data.password,
      email,
    });
    if (!result.isSuccess) {
      //
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit(submit)}
        className="p-5 rounded-lg shadow w-full md:w-md"
      >
        <h2 className="text-xl font-semibold mb-2">Reset your password</h2>
        <PasswordInput
          label="New password"
          {...register("password")}
          error={errors.password?.message}
        />

        <PasswordInput
          label="Confirm password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
        <LoadingButton loading={loading} text="Reset Password" type="submit" />
        {/* {error && <p className="text-red-600 pt-2">{error}</p>} */}
      </form>
    </div>
  );
}
