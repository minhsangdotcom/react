import { FormEvent, useState } from "react";
import authService from "@features/auth/authService";
import NormalInput from "@/components/Input";
import LoadingButton from "@components/LoadingButton";

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
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg shadow p-5 w-full md:w-md"
      >
        <h2 className="text-xl font-semibold mb-2">Forgot your password?</h2>
        <p className="text-muted-foreground mb-6">
          Enter your email address and we’ll send you a reset link.
        </p>
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
    </div>
  );
}
