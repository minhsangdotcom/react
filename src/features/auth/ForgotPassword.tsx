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
    <div className="my-20 md:my-10">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg shadow p-5 w-full md:w-md h-auto"
      >
        <h2 className="text-xl font-semibold mb-2">
          {t(TRANSLATION_KEYS.forgotPassword.title)}
        </h2>

        <p className="text-muted-foreground mb-6">
          {t(TRANSLATION_KEYS.forgotPassword.description)}
        </p>

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
      </form>
    </div>
  );
}
