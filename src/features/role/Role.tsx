import { DataTableColumnHeader } from "@dscn/components/data-table/data-table-column-header";
import { useDataTable } from "@dscn/hooks/use-data-table";
import { useEffect, useMemo, useState } from "react";
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
import RolePopup from "./RolePopup";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { IApiResult } from "@/utils/http/IApiResult";
import IResponse from "@/types/IResponse";
dayjs.extend(utc);
dayjs.extend(timezone);

async function fetchRole() {
  return await roleService.list({});
}

export default function Role() {
  const [role, setRole] = useState<Array<IRole>>();

  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const columns = useMemo<ColumnDef<IRole>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Id" />
        ),
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
        meta: {
          label: "Id",
          placeholder: "Search by Id...",
          variant: "text",
        },
        enableColumnFilter: false,
      },
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
        meta: {
          label: "Name",
          placeholder: "Search by name...",
          variant: "text",
          //icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "description",
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => <div>{row.getValue("description")}</div>,
        meta: {
          label: "Description",
          placeholder: "Search by description...",
          variant: "text",
          //icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => (
          <div>
            {dayjs
              .utc(row.getValue("createdAt"))
              .tz(dayjs.tz.guess())
              .format("DD/MM/YYYY")}
          </div>
        ),
        meta: {
          label: "Created At",
          placeholder: "Search by description...",
          variant: "dateRange",
          //icon: Text ,
        },
        enableColumnFilter: true,
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
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={(_) => {
                    setId(row.getValue("id"));
                    setDialogOpen(true);
                  }}
                >
                  Delete
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
    data: role ?? [],
    columns,
    pageCount: role?.length ?? 100,
    initialState: {
      pagination: {
        pageSize: defaultParams.perPage,
        pageIndex: defaultParams.page!,
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
    }
  };

  useEffect(() => {
    if (open || dialogOpen) {
      return;
    }
    setLoading(true);
    fetchRole()
      .then((result) => {
        const roles = result.data!.results as IRole[];
        const sortedRoles = roles.sort(
          (a: IRole, b: IRole) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRole([...sortedRoles]);
      })
      .finally(() => setLoading(false));
  }, [open, dialogOpen]);

  return (
    <>
      <div className="p-3 min-h-screen">
        {/* Header with Title */}
        <h1 className="text-xl font-semibold text-gray-800 mt-5 ml-2">Role</h1>

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
          Create new
        </button>

        <DataTable
          table={table}
          hasPagination={false}
          aria-sort="none"
          loading={loading}
        />
      </div>

      <RolePopup open={open} roleId={id} setOpen={setOpen} setRoleId={setId} />

      <ConfirmDialog
        isOpen={dialogOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        onConfirm={handleDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  );
}
