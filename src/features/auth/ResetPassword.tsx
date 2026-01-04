import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import authService from "@features/auth/authService";

import LoadingButton from "@components/LoadingButton";
import PasswordInput from "@components/PasswordInput";

export default function ResetPassword() {
  const [search] = useSearchParams();
  const token = search.get("token") ?? "";
  const id = search.get("id") ?? "";

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
    const result = await authService.resetPassword(id, {
      token,
      password,
    });
    if (!result.isSuccess) {
      setError(result.error?.errorDetails.en!);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 rounded-lg shadow mt-10 mx-auto w-full sm:w-2/3 lg:w-1/3 xl:max-w-lg"
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
  );
}
