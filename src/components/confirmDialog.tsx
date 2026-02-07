import { TRANSLATION_KEYS } from "@/config/translationKey";
import { useTranslation } from "react-i18next";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-40">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800">
          {title ?? t(TRANSLATION_KEYS.common.dialog.confirm.default.title)}
        </h2>

        <p className="mt-2 text-sm text-gray-600"> {message ?? t(TRANSLATION_KEYS.common.dialog.confirm.default.message)}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={onCancel}
          >
             {cancelText ?? t(TRANSLATION_KEYS.common.dialog.confirm.default.cancel)}
          </button>

          <button
            type="button"
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 cursor-pointer"
            onClick={onConfirm}
          >
            {confirmText ?? t(TRANSLATION_KEYS.common.dialog.confirm.default.confirm)}
          </button>
        </div>
      </div>
    </div>
  );
}
