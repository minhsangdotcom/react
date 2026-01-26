import { DataTableColumnHeader } from "@dscn/components/data-table/data-table-column-header";
import { useDataTable } from "@dscn/hooks/use-data-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { roleService } from "@/features/role/roleService";
import { IRole } from "@/features/role/IRole";
import { DataTable } from "@dscn/components/data-table/data-table";

import { defaultParams } from "@/types/Params";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@dscn/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@dscn/components/ui/button";
import RoleModal from "./RoleModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { showSuccessToast } from "@/notifications/toastSuccess";
import { useAppSelector } from "@/store/hook";
import {
  IPermission,
  IPermissionGroup,
  IPermissionGroupResponse,
} from "@/types/permission/IPermission";
import permissionService from "@/services/permission/permissionService";
import { ulid } from "ulidx";
import { Loading } from "@/components/Loading";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEYS } from "@/config/translationKey";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function Role() {
  const [role, setRole] = useState<Array<IRole>>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [referenceLoading, setReferenceLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [group, setGroup] = useState<IPermissionGroup[]>([]);
  const { code } = useAppSelector((store) => store.language);
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<IRole>[]>(
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
          return <div>{description ? description : "_"}</div>;
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
          <div>
            {dayjs
              .utc(row.getValue("createdAt"))
              .tz(dayjs.tz.guess())
              .format("DD/MM/YYYY")}
          </div>
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
    []
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
    fetchRoles();
  }, [open, dialogOpen, code]);

  async function fetchRoles() {
    setLoading(true);
    const result = await roleService.list({});
    if (result.success) {
      const roles = result.data?.results as IRole[];
      const sortedRoles = roles.sort(
        (a: IRole, b: IRole) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRole([...sortedRoles]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadReferenceData();
  }, [code]);

  async function loadReferenceData() {
    setReferenceLoading(true);
    const result = await permissionService.list();
    if (result.success) {
      const permissions = result.data?.results as IPermissionGroupResponse[];
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
      <div className="p-4 md:p-6 w-full">
        {/* Header with Title */}
        <h1 className="text-xl font-semibold text-gray-800 mt-5 ml-2">
          {t(TRANSLATION_KEYS.role.title)}
        </h1>

        {/* Add Button aligned to the right */}
        <button
          className="float-right my-3 cursor-pointer
          rounded-lg shadow-sm
          bg-brand-primary text-white font-medium
          px-6 py-2
          transition-colors duration-200
          hover:bg-brand-primary-hover
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-brand-primary/50
          active:scale-[0.98]
          max-sm:w-full
          max-sm:py-3
          max-sm:text-base
          "
          onClick={() => {
            setOpen(true);
          }}
        >
          {t(TRANSLATION_KEYS.common.actions.create)}
        </button>

        <DataTable
          table={table}
          hasPagination={false}
          aria-sort="none"
          loading={loading}
        />
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
            `${id ? "Update role success!" : "Create role success"}`
          );
          setGroup(resetPermissionGroups(group));
        }}
      />

      <ConfirmDialog
        isOpen={dialogOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        onConfirm={handleDelete}
        onCancel={() => {
          setDialogOpen(false);
          setId(null);
        }}
      />
    </>
  );
}

function mapPermission(permission: any): IPermission {
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
  response: IPermissionGroupResponse[]
): IPermissionGroup[] {
  return response.map((group) => ({
    name: group.name,
    label: group.nameTranslation,
    permissions: group.permissions.map(mapPermission),
  }));
}

function resetPermissionGroups(groups: IPermissionGroup[]): IPermissionGroup[] {
  return groups.map((group) => ({
    ...group,
    permissions: resetPermissions(group.permissions),
  }));
}

function resetPermissions(permissions: IPermission[]): IPermission[] {
  return permissions.map((permission) => ({
    ...permission,
    checked: false,
    expanded: false,
    children: resetPermissions(permission.children ?? []),
  }));
}
