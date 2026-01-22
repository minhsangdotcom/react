import { FormEvent, useState } from "react";
import authService from "@features/auth/authService";
import Input from "@/components/Input";
import LoadingButton from "@components/LoadingButton";

export default function RequestResetPassword() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authService.requestResetPassword(email);
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
          Enter your email address and we will send you a reset link.
        </p>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          inputName="email"
          required
        />
        <LoadingButton loading={loading} text="Send Reset Link" type="submit" />
      </form>
    </div>
  );
}
