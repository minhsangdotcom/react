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

import { Avatar, AvatarImage } from "@dscn/components/ui/avatar";

import { useNavigate } from "react-router-dom";
import { logout } from "@features/auth/authSlice";
import { useAppDispatch } from "@/store/hook";
import { useTranslation } from "react-i18next";

export function UserAvatarMenu({ avatarUrl }: { avatarUrl?: string }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      {/* TRIGGER */}
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 md:h-10 md:w-10 cursor-pointer">
          <AvatarImage src={avatarUrl} alt="User avatar" />
        </Avatar>
      </DropdownMenuTrigger>

      {/* MENU */}
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          {t("navbar.profile.value")}
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {t("navbar.profile.settings.value")}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => navigate("settings/change-password")}
              >
                {t("navbar.profile.settings.changePassword")}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => {
            dispatch(logout());
          }}
        >
          {t("navbar.profile.Logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
