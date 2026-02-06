import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@dscn/components/ui/dropdown-menu";
import { Moon, LogOut, Settings, UserRound } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@dscn/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { logout } from "@features/auth/authSlice";
import { useAppDispatch } from "@/store/hook";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEYS } from "@/config/translationKey";
import { Switch } from "@/design-system/cn/components/ui/switch";

export function NavbarAvatar({
  avatarUrl,
  fullName,
  email,
}: {
  avatarUrl?: string;
  fullName: string;
  email: string;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      {/* TRIGGER */}
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 overflow-hidden rounded-full cursor-pointer">
          <AvatarImage src={avatarUrl} className="w-full h-full object-cover" />
        </Avatar>
      </DropdownMenuTrigger>

      {/* MENU */}
      <DropdownMenuContent side="bottom" align="end">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-8 w-8 overflow-hidden rounded-full">
            <AvatarImage
              src={avatarUrl}
              className="w-full h-full object-cover"
            />
          </Avatar>

          <div className="flex flex-col">
            <span className="text-sm font-semibold">{fullName}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </div>
        <DropdownMenuItem
          className="flex items-center gap-2 px-1"
          onClick={() => navigate("/profile")}
        >
          <UserRound className="text-black w-5 h-5" />
          {t(TRANSLATION_KEYS.navbar.profileMenu.profile)}
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2 px-1">
            <Settings className="w-4 h-4" />
            {t(TRANSLATION_KEYS.navbar.profileMenu.settingAndSecurity.value)}
          </DropdownMenuSubTrigger>

          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => navigate("settings/change-password")}
              >
                {t(
                  TRANSLATION_KEYS.navbar.profileMenu.settingAndSecurity
                    .changePassword
                )}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <div className="flex items-center justify-between px-1 py-2">
          <div className="flex items-center gap-2 text-sm">
            <Moon className="h-4 w-4" />
            Dark Mode
          </div>
          <Switch className="cursor-pointer" />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 flex items-center gap-2"
          onClick={() => {
            dispatch(logout());
          }}
        >
          <LogOut />
          {t(TRANSLATION_KEYS.navbar.profileMenu.logout)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
