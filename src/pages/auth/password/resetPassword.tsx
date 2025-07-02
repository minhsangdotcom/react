import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import authService from "../../../services/auth/authService";

import LoadingButton from "../../../components/loadingButton";

import "./resetPassword.css";
import PasswordInput from "../../../components/passwordInput";

export default function ResetPassword() {
  const [search] = useSearchParams();
  const token = search.get("token") ?? "";
  const id = search.get("id") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  //const navigate = useNavigate();

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
      className="p-5 max-sm:w-9/10 max-md:w-7/10 max-lg:w-5/10 max-xl:w-lg max-2xl:w-md rounded-lg shadow  mt-10 mx-auto p-10"
    >
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
