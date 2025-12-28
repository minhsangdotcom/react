import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@dscn/components/ui/dropdown-menu";

import { Avatar, AvatarImage } from "@dscn/components/ui/avatar";

import { useNavigate } from "react-router-dom";
import { logout } from "@features/auth/authSlice";
import { useAppDispatch } from "@/store/hook";

export function UserAvatarMenu({ avatarUrl }: { avatarUrl?: string }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <DropdownMenu>
      {/* TRIGGER */}
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={avatarUrl} alt="User avatar" />
        </Avatar>
      </DropdownMenuTrigger>

      {/* MENU */}
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate("/settings")}>
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => {
            dispatch(logout());
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
