import { SidebarSeparator, SidebarTrigger } from "@/src/components/ui/sidebar";
import { profileAsync } from "@/src/features/auth/authAction";
import { useAppDispatch } from "@/src/store/hook";
import { IUserProfileResponse } from "@/src/types/user/IUserProfile";
import { useEffect, useState } from "react";
import { UserAvatarMenu } from "./UserAvatarMenu";

export default function AdminLayout() {
  const [loading, setLoading] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<IUserProfileResponse>(
    {} as IUserProfileResponse
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    setLoading(true);
    dispatch(profileAsync())
      .then((response: any) => {
        const profileResponse = response.payload?.data
          ?.results as IUserProfileResponse;
        if (profileResponse) {
          setUserProfile(profileResponse);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <header className="relative flex h-14 items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>

      <UserAvatarMenu avatarUrl="/images/default-avatar.png" />

      <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
    </header>
  );
}
