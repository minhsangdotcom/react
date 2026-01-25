import { Outlet } from "react-router-dom";
import { Language } from "./components/Language";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useState } from "react";
import i18n from "@/i18";
import { selectLanguage } from "@/store/language/languageSlice";
import { LanguageCode } from "@/types/LanguageType";

export function PublicLayout() {
  const { code } = useAppSelector((store) => store.language);
  const [language, setLanguage] = useState<string>(code);
  const dispatch = useAppDispatch();
  return (
    <>
      <header className="flex items-center justify-end px-6 py-4">
        <Language
          currentLang={language!}
          onChange={(lang) => {
            setLanguage(lang);
            i18n.changeLanguage(lang);
            dispatch(selectLanguage(lang as LanguageCode));
          }}
        />
      </header>

      <main className="flex flex-1 justify-center min-h-screen">
        <Outlet />
      </main>
    </>
  );
}
