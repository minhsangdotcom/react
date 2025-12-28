import { SidebarTrigger } from "@dscn/components/ui/sidebar";
import { profileAsync } from "@features/profile/profileAction";
import { useAppDispatch } from "@/store/hook";
import { useEffect, useState } from "react";
import { UserAvatarMenu } from "./UserAvatarMenu";

export default function AdminLayout() {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setLoading(true);
    dispatch(profileAsync()).finally(() => {
      setLoading(false);
    });
  }, []);
  return (
    <header className="relative flex h-14 items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>

      {!loading ? (
        <UserAvatarMenu avatarUrl="/images/avatar-boy.png" />
      ) : (
        "Loading..."
      )}

      <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
    </header>
  );
}
