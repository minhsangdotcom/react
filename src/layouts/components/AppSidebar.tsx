import { User, Shield, ChevronRight, Lock } from "lucide-react";

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

const groupedItems = [
  {
    name: "Identity",
    icon: Lock,
    items: [
      {
        title: "User",
        url: "/identity/users",
        icon: User,
      },
      {
        title: "Role",
        url: "/identity/roles",
        icon: Shield,
      },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  console.log("🚀 ~ AppSidebar ~ state:", state);
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
            <span className="h-6 w-6 shrink-0 rounded bg-slate-800 flex items-center justify-center text-sm">
              U
            </span>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarMenu>
        {groupedItems.map((group) => (
          <Collapsible
            defaultOpen={false}
            className="group/collapsible"
            key={group.name}
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="group/menu-button">
                  {/* ICON — always visible */}
                  {group.icon && <group.icon className="h-4 w-4 shrink-0" />}

                  {/* TEXT — hide when sidebar is collapsed */}
                  <span
                    className="
                    truncate
                    group-data-[collapsible=icon]/sidebar:hidden
                  "
                  >
                    {group.name}
                  </span>

                  {/* CHEVRON — hide when collapsed */}
                  <ChevronRight
                    className="
                        ml-auto h-4 w-4 transition-transform
                        group-data-[state=open]/collapsible:rotate-90
                        group-data-[collapsible=icon]/sidebar:hidden
                      "
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {group.items.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <NavLink
                        to={item.url}
                        key={item.title}
                        className="flex items-center gap-2"
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </Sidebar>
  );
}
