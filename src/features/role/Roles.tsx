import { DataTableColumnHeader } from "@dscn/components/data-table/data-table-column-header";
import { useDataTable } from "@dscn/hooks/use-data-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { roleService } from "@/features/role/roleService";
import { Role } from "@/features/role/IRole";
import { DataTable } from "@dscn/components/data-table/data-table";

import { defaultParams } from "@/types/QueryParam";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@dscn/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@dscn/components/ui/button";
import { RoleModal } from "./RoleModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { showSuccessToast } from "@/notifications/toastSuccess";
import { useAppSelector } from "@/store/hook";
import {
  Permission,
  PermissionGroup,
  PermissionGroupResponse,
} from "@/types/permission/IPermission";
import permissionService from "@/services/permission/permissionService";
import { ulid } from "ulidx";
import { Loading } from "@/components/Loading";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEYS } from "@/config/translationKey";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/design-system/cn/components/ui/tooltip";
import { parseDateTime } from "@/utils/dateFormat";
dayjs.extend(utc);
dayjs.extend(timezone);

export function Roles() {
  const [role, setRole] = useState<Role[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [referenceLoading, setReferenceLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [group, setGroup] = useState<PermissionGroup[]>([]);
  const { code } = useAppSelector((store) => store.language);
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Id" />
        ),
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
      },
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            id="name"
            title={t(TRANSLATION_KEYS.role.table.fields.name)}
          />
        ),
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
      },
      {
        id: "description",
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            id="description"
            title={t(TRANSLATION_KEYS.role.table.fields.description)}
          />
        ),
        cell: ({ row }) => {
          const description: string = row.getValue("description");

          return !description ? (
            <>__</>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-50 md:w-100 cursor-pointer">
                  <p className="md:hidden line-clamp-1 text-sm wrap-break-word">
                    {`${description.slice(0, 20)} ...`}
                  </p>
                  <p className="hidden md:block line-clamp-1 text-sm wrap-break-word">
                    {`${description.slice(0, 50)} ...`}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="max-w-100 max-h-50 overflow-x-hidden text-black border-2 border-gray-200 bg-gray-200
                [--tooltip-bg:var(--color-gray-200)]
                "
              >
                <p className="text-sm whitespace-pre-wrap wrap-break-word">
                  {description}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            id="createdAt"
            title={t(TRANSLATION_KEYS.common.table.fields.createdAt)}
          />
        ),
        cell: ({ row }) => (
          <div>{parseDateTime(row.getValue("createdAt"), "DD/MM/YYYY")}</div>
        ),
      },
      {
        id: "actions",
        cell: function Cell({ row }) {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="focus:outline-none focus:ring-0 focus:ring-offset-0"
                >
                  <MoreHorizontal className="h-4 w-4 text-dark-600 dark:text-dark-300" />
                  <span className="sr-only">isOpen menu</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={4}
                className="min-w-35 bg-white dark:bg-800 rounded-lg shadow-lg p-1 z-100 cursor-pointer border-0"
              >
                <DropdownMenuItem
                  onClick={(_) => {
                    setId(row.getValue("id"));
                    setOpen(true);
                  }}
                >
                  {t(TRANSLATION_KEYS.common.actions.edit)}
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={(_) => {
                    setId(row.getValue("id"));
                    setDialogOpen(true);
                  }}
                >
                  {t(TRANSLATION_KEYS.common.actions.delete)}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 32,
      },
    ],
    [code]
  );

  const { table } = useDataTable({
    data: role,
    columns,
    pageCount: 100,
    initialState: {
      pagination: {
        pageSize: defaultParams.perPage,
        pageIndex: 0,
      },
      columnVisibility: {
        id: false,
      },
    },
    getRowId: (row: any) => row.id,
  });

  const handleDelete = async () => {
    try {
      await roleService.delete(id!);
    } catch (error) {
      //
    } finally {
      setDialogOpen(false);
      setId(null);
    }
  };

  useEffect(() => {
    if (open || dialogOpen) {
      return;
    }
    const controller = new AbortController();

    fetchRoles(controller.signal);

    return () => {
      controller.abort();
    };
  }, [open, dialogOpen, code]);

  useEffect(() => {
    const controller = new AbortController();
    loadReferenceData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [code]);

  async function fetchRoles(signal: AbortSignal) {
    setLoading(true);
    const result = await roleService.list({}, signal);
    if (result.success) {
      const roles = result.data?.results as Role[];
      const sortedRoles = roles.sort(
        (a: Role, b: Role) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRole([...sortedRoles]);
    }
    setLoading(false);
  }

  async function loadReferenceData(signal: AbortSignal) {
    setReferenceLoading(true);
    const result = await permissionService.list(signal);
    if (result.success) {
      const permissions = result.data?.results as PermissionGroupResponse[];
      let groups = toListPermissionGroup(permissions);
      setGroup(groups);
    }
    setReferenceLoading(false);
  }

  if (referenceLoading) {
    return (
      <div className="px-4 h-[calc(100vh-64px)]">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-1 p-4 md:p-6 w-full">
        {/* Header with Title */}
        <h1 className="text-xl font-semibold text-gray-800 py-3">
          {t(TRANSLATION_KEYS.role.title)}
        </h1>

        {/* Add Button aligned to the right */}
        <div className="flex justify-end">
          <button
            className="cursor-pointer rounded-lg shadow-sm bg-brand-primary text-white font-medium px-6 py-2 text-base w-full my-2 transition-colors duration-200 hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 active:scale-[0.98] md:w-auto md:my-0"
            onClick={() => {
              setOpen(true);
            }}
          >
            {t(TRANSLATION_KEYS.common.actions.create)}
          </button>
        </div>

        <div className="py-3">
          <DataTable table={table} aria-sort="none" loading={loading} />
        </div>
      </div>

      <RoleModal
        open={open}
        roleId={id}
        group={group}
        setGroup={setGroup}
        onRequestClose={() => {
          setOpen(false);
          setId(null);
          setGroup(resetPermissionGroups(group));
        }}
        onSubmit={() => {
          showSuccessToast(
            `${
              id
                ? t(
                    TRANSLATION_KEYS.common.notification.action.success.update,
                    {
                      entity: t(TRANSLATION_KEYS.role.entity),
                    }
                  )
                : t(
                    TRANSLATION_KEYS.common.notification.action.success.create,
                    {
                      entity: t(TRANSLATION_KEYS.role.entity),
                    }
                  )
            }`
          );
          setGroup(resetPermissionGroups(group));
        }}
      />

      <ConfirmDialog
        isOpen={dialogOpen}
        title={t(TRANSLATION_KEYS.common.dialog.confirm.delete.title, {
          entity: t(TRANSLATION_KEYS.role.entity),
        })}
        message={t(TRANSLATION_KEYS.common.dialog.confirm.delete.message, {
          entity: t(TRANSLATION_KEYS.role.entity),
        })}
        onConfirm={handleDelete}
        onCancel={() => {
          setDialogOpen(false);
          setId(null);
        }}
      />
    </>
  );
}

function mapPermission(permission: any): Permission {
  return {
    id: ulid(),
    permissionId: permission.id,
    code: permission.code,
    label: permission.codeTranslation,
    checked: false,
    expanded: false,
    children: permission.children?.map(mapPermission) ?? [],
    createdAt: permission.createdAt,
  };
}

function toListPermissionGroup(
  response: PermissionGroupResponse[]
): PermissionGroup[] {
  return response.map((group) => ({
    name: group.name,
    label: group.nameTranslation,
    permissions: group.permissions.map(mapPermission),
  }));
}

function resetPermissionGroups(groups: PermissionGroup[]): PermissionGroup[] {
  return groups.map((group) => ({
    ...group,
    permissions: resetPermissions(group.permissions),
  }));
}

function resetPermissions(permissions: Permission[]): Permission[] {
  return permissions.map((permission) => ({
    ...permission,
    checked: false,
    expanded: false,
    children: resetPermissions(permission.children ?? []),
  }));
}
