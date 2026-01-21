import { SidebarTrigger } from "@dscn/components/ui/sidebar";
import { profileAsync } from "@features/profile/profileAction";
import { useAppDispatch } from "@/store/hook";
import { useEffect, useState } from "react";
import { UserAvatarMenu } from "./UserAvatarMenu";
import { IUserProfileResponse } from "@/features/profile/IUserProfile";
import { defaultAvatarPicker } from "@/utils/defaultAvatarPicker";

export default function AdminLayout() {
  const [loading, setLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>();
  
  const dispatch = useAppDispatch();
  useEffect(() => {
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
  }, []);
  return (
    <header className="relative flex items-center justify-between px-4 py-3">
      <SidebarTrigger />
      {!loading ? <UserAvatarMenu avatarUrl={avatar} /> : "Loading..."}

      <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
    </header>
  );
}
