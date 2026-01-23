import { SidebarTrigger } from "@dscn/components/ui/sidebar";
import { profileAsync } from "@features/profile/profileAction";
import { useAppDispatch } from "@/store/hook";
import { useEffect, useRef, useState } from "react";
import { UserAvatarMenu } from "./UserAvatarMenu";
import { IUserProfileResponse } from "@/features/profile/IUserProfile";
import { defaultAvatarPicker } from "@/utils/defaultAvatarPicker";
import { CircleLanguagePicker } from "./Language";
import {
  Avatar,
  AvatarFallback,
} from "@/design-system/cn/components/ui/avatar";
import { Skeleton } from "@/design-system/cn/components/ui/skeleton";
import { DEFAULT_LANGUAGE } from "@/config/i18nConfig";
import { useTranslation } from "react-i18next";
import localStorageHelper from "@/utils/storages/localStorageHelper";

import Config from "@config/keyConfig";

export default function AdminLayout() {
  const [loading, setLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>();
  const [language, setLanguage] = useState<string>(DEFAULT_LANGUAGE);
  const { t, i18n } = useTranslation();

  const ref = useRef<boolean>(false);

  const dispatch = useAppDispatch();
  useEffect(() => {
    i18n.changeLanguage(DEFAULT_LANGUAGE);
    if (ref.current) {
      return;
    }

    setLoading(true);
    dispatch(profileAsync())
      .unwrap()
      .then((result) => {
        const user = result.data?.results as IUserProfileResponse;
        setAvatar(user.avatar ?? defaultAvatarPicker.getAvatar(user.gender));
      })
      .finally(() => {
        setLoading(false);
      });
    ref.current = true;
  }, []);

  return (
    <header className="relative flex items-center justify-between px-4 py-3">
      <SidebarTrigger />
      <div className="flex gap-2 items-end">
        <CircleLanguagePicker
          currentLang={language!}
          onChange={(lang) => {
            setLanguage(lang);
            i18n.changeLanguage(lang);
            localStorageHelper.set(Config.currentLanguage, lang);
          }}
        />
        {!loading ? (
          <UserAvatarMenu avatarUrl={avatar} />
        ) : (
          <Avatar className="h-8 w-8 md:h-10 md:w-10 cursor-pointer">
            <AvatarFallback>
              <Skeleton className="h-full w-full rounded-full" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
    </header>
  );
}
