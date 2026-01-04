import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import authService from "@features/auth/authService";

import LoadingButton from "@components/LoadingButton";
import PasswordInput from "@components/PasswordInput";

export default function ResetPassword() {
  const [search] = useSearchParams();
  const token = search.get("token") ?? "";
  const email = search.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    const result = await authService.resetPassword({
      token,
      password,
      email,
    });
    if (!result.isSuccess) {
      setError(result.error?.errorDetails.en!);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="p-5 rounded-lg shadow w-full md:w-md"
      >
        <h2 className="text-xl font-semibold mb-2">Reset your password</h2>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="New password"
          isRequired={true}
        />

        <PasswordInput
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          label="Confirm password"
          isRequired={true}
        />
        <LoadingButton loading={loading} text="Reset Password" type="submit" />
        {error && <p className="text-red-600 pt-2">{error}</p>}
      </form>
    </div>
  );
}
