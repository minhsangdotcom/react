import {
  User,
  Shield,
  ChevronRight,
  Lock,
  User2,
  User2Icon,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@dscn/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ComponentType } from "react";
import { cn } from "@/design-system/cn/lib/utils";

interface SidebarItem {
  title: string;
  url: string;
  icon: ComponentType<{ className?: string }> | null;
}

interface GroupType {
  name: string;
  icon: ComponentType<{ className?: string }> | null;
  items: SidebarItem[];
}

function getGroups(): GroupType[] {
  const { t } = useTranslation();
  return [
    {
      name: "identity",
      icon: null,
      items: [
        {
          title: t("navigation.User"),
          url: "/identity/users",
          icon: User2,
        },
        {
          title: t("navigation.Role"),
          url: "/identity/roles",
          icon: Shield,
        },
      ],
    },
  ];
}

export function AppSidebar() {
  const { state } = useSidebar();
  return (
    <Sidebar
      side="left"
      collapsible="icon"
      variant="inset"
      className="group/sidebar"
    >
      <SidebarHeader className="h-14 flex items-center px-4">
        <NavLink
          to="/"
          className="flex items-center gap-2 font-semibold text-lg truncate"
        >
          {state === "expanded" ? (
            <span className="line-through">Untitled 2025</span>
          ) : (
            <span className="h-6 w-6 shrink-0 rounded flex items-center justify-center text-md line-through">
              U
            </span>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarMenu>
        {getGroups()
          .find((x) => x.name == "identity")
          ?.items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink
                to={item.url}
                className={`flex items-center gap-2 min-w-0 mx-4 ${state == "collapsed" && "md:justify-center"}`}
              >
                {item.icon && (
                  <item.icon
                    className={
                      state === "expanded" ? "h-4 w-4 shrink-0" : "h-5 w-5"
                    }
                  />
                )}

                <span
                  className={`truncate ${state == "collapsed" && "md:hidden"}`}
                >
                  {item.title}
                </span>
              </NavLink>
            </SidebarMenuItem>
          ))}
      </SidebarMenu>
    </Sidebar>
  );
}
