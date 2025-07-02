import { FormEvent, useState } from "react";
import authService from "../../../services/auth/authService";
import NormalInput from "../../../components/normalInput";
import LoadingButton from "../../../components/loadingButton";

export default function RequestResetPassword() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await authService.requestResetPassword(email);
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
      <NormalInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        name="email"
        isRequired={true}
      />
      <LoadingButton loading={loading} text="Send Reset Link" type="submit" />
      {error && <p>{error}</p>}
    </form>
  );
}
