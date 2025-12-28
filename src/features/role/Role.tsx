import { DataTableColumnHeader } from "@dscn/components/data-table/data-table-column-header";
import { useDataTable } from "@dscn/hooks/use-data-table";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { roleService } from "@/features/role/roleService";
import { IRole } from "@/features/role/IRole";
import { DataTable } from "@dscn/components/data-table/data-table";

import { Loading } from "@components/Loading";
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
import { Dialog } from "@dscn/components/ui/dialog";
import ICreateRoleRequest from "@/features/role/ICreateRoleRequest";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import IUpdateRoleRequest from "@/features/role/IUpdateRoleRequest";
import React from "react";
import { useAppSelector } from "@/store/hook";
dayjs.extend(utc);
dayjs.extend(timezone);

const Popup = React.memo(function ({
  isOpen,
  setOpen,
  handleAddRole,
  handleUpdateRole,
  id,
}: {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleAddRole: (roleData: ICreateRoleRequest) => Promise<void>;
  handleUpdateRole: (roleData: IUpdateRoleRequest) => Promise<void>;
  id: string | null;
}) {
  return (
    <Dialog open={isOpen}>
      {isOpen && (
        <RolePopup
          onCreate={handleAddRole}
          onUpdate={handleUpdateRole}
          setOpen={setOpen}
          roleId={id}
        />
      )}
    </Dialog>
  );
});

async function fetchRole() {
  return await roleService.list({});
}

export default function Role() {
  const { isLoading } = useAppSelector((store) => store.auth);
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
          placeholder: "Search by name...",
          variant: "text",
          //icon: Text,
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
                className="min-w-[140px] bg-white dark:bg-800 rounded-lg shadow-lg p-1 z-100 cursor-pointer border-0"
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
    },
    getRowId: (row: any) => row.id,
  });

  const handleAddRole = async (roleData: ICreateRoleRequest) => {
    setLoading(true);
    const result = await roleService.create(roleData);
    setLoading(false);
    if (!result.isSuccess) {
      console.log("create error:" + result.error);
    }
    setOpen(false);
  };

  const handleUpdateRole = async (roleData: IUpdateRoleRequest) => {
    setLoading(true);
    const result = await roleService.update(id!, roleData);
    setLoading(false);
    if (!result.isSuccess) {
      console.log("update error:" + result.error);
    }
    setOpen(false);
  };

  const handleDelete = async () => {
    const result = await roleService.delete(id!);
    if (!result.isSuccess) {
      console.log("delete error:" + result.error);
    }
    setDialogOpen(false);
  };

  useEffect(() => {
    if (!open && !dialogOpen) {
      setLoading(true);
      fetchRole()
        .then((result) => {
          if (result?.data?.results) {
            const sortedRoles = result?.data?.results.sort(
              (a : any, b : any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
            setRole([...sortedRoles]);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [open, dialogOpen]);

  if (loading || isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="space-y-4">
        {/* Header with Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 mt-5 ml-5">
            Role
          </h2>
        </div>

        {/* Table Container */}
        <div className="p-4 bg-white">
          {/* Add Button aligned to the right */}
          <div className="flex justify-end mb-4">
            <button
              className="bg-brand-primary text-white font-medium px-8 py-2 rounded-lg shadow-sm hover:bg-brand-primary-hover transition"
              onClick={() => {
                setOpen(true);
              }}
            >
              Create new
            </button>
          </div>

          <DataTable
            table={table}
            className="w-full text-sm text-left text-gray-700"
            hasPagination={false}
            aria-sort="none"
          />
        </div>
      </div>

      <Popup
        isOpen={open}
        id={id}
        setOpen={setOpen}
        handleAddRole={handleAddRole}
        handleUpdateRole={handleUpdateRole}
      />

      <ConfirmDialog
        isOpen={dialogOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        onConfirm={handleDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
}
