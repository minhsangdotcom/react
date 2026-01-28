import { FormEvent, useState } from "react";
import authService from "@features/auth/authService";
import Input from "@/components/Input";
import LoadingButton from "@components/LoadingButton";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEYS } from "@/config/translationKey";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authService.requestResetPassword(email);
    setLoading(false);
  };
  return (
    <div className="w-full max-w-md py-5">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-background p-6 shadow-lg border border-border"
      >
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          {t(TRANSLATION_KEYS.forgotPassword.title)}
        </h2>

        <p className="text-sm text-muted-foreground mb-6">
          {t(TRANSLATION_KEYS.forgotPassword.description)}
        </p>

        <div className="space-y-4">
          <Input
            label={t(TRANSLATION_KEYS.forgotPassword.form.email)}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputName="email"
            required
          />

          <LoadingButton
            loading={loading}
            text={t(TRANSLATION_KEYS.forgotPassword.button.send)}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}
