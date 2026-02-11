import { SubmitEvent, useState } from "react";
import authService from "@features/auth/authService";
import Input from "@/components/Input";
import LoadingButton from "@/components/LoadingButton";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEYS } from "@/config/translationKey";
import { showSuccessToast } from "@/notifications/toastSuccess";

export function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await authService.requestResetPassword(email);
    setLoading(false);
    if (result.success) {
      showSuccessToast(
        t(TRANSLATION_KEYS.common.notification.action.success.send, {
          object: t(TRANSLATION_KEYS.forgotPassword.button.send.name),
        })
      );
      setEmail("");
    }
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
            label={t(TRANSLATION_KEYS.forgotPassword.form.fields.email)}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputName="email"
            required
          />

          <LoadingButton
            loading={loading}
            text={t(TRANSLATION_KEYS.forgotPassword.button.send.title)}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}
