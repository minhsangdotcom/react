import { DataTableColumnHeader } from "@/src/components/data-table/data-table-column-header";
import { useDataTable } from "@/src/hooks/use-data-table";
import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { roleService } from "@/src/services/roles/roleService";
import { IRole } from "@/src/types/role/IRole";
import { DataTable } from "@/src/components/data-table/data-table";

import LoadingPage from "@/src/components/loading";
import { defaultParams } from "@/src/types/Params";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import AddRoleModal from "@/src/pages/role/roleFormModal";
import { Dialog } from "@/src/components/ui/dialog";
import ICreateRoleRequest from "@/src/types/role/ICreateRoleRequest";
import { ConfirmDialog } from "@/src/components/confirmDialog";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import IUpdateRoleRequest from "@/src/types/role/IUpdateRoleRequest";
import React from "react";
import { useAppSelector } from "@/src/store/hook";
dayjs.extend(utc);
dayjs.extend(timezone);

type PopUpOpen = {
  isCreateOpen: boolean;
  isUpdateOpen: boolean;
};

const Popup = React.memo(function ({
  popupOpen,
  setOpen,
  handleAddRole,
  handleUpdateRole,
  id,
}: {
  popupOpen: PopUpOpen;
  setOpen: React.Dispatch<React.SetStateAction<PopUpOpen>>;
  handleAddRole: (roleData: ICreateRoleRequest) => Promise<void>;
  handleUpdateRole: (roleData: IUpdateRoleRequest) => Promise<void>;
  id: string | undefined;
}) {
  console.log("Dialog component re-rendered");
  return (
    <Dialog open={popupOpen.isCreateOpen || popupOpen.isUpdateOpen}>
      {(popupOpen.isCreateOpen || popupOpen.isUpdateOpen) && (
        <AddRoleModal
          onSubmit={popupOpen.isCreateOpen ? handleAddRole : handleUpdateRole}
          setOpen={setOpen}
          roleId={popupOpen.isCreateOpen ? undefined : id}
          mode={popupOpen.isCreateOpen ? "create" : "update"}
        />
      )}
    </Dialog>
  );
});

export default function RolePage() {
  const { isLoading  } = useAppSelector((store) => store.auth);
  const [role, setRole] = useState<Array<IRole>>();

  const [loading, setLoading] = useState<boolean>(false);
  const [popupOpen, setOpen] = useState<PopUpOpen>({
    isCreateOpen: false,
    isUpdateOpen: false,
  });
  const [isOpenConfirm, setOpenConfirm] = useState(false);
  const [id, setId] = useState<string | undefined>("");
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
                    setOpen({ isUpdateOpen: true, isCreateOpen: false });
                  }}
                >
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={(_) => {
                    setId(row.getValue("id"));
                    setOpenConfirm(true);
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

  useEffect(() => {
    if (
      (!popupOpen.isCreateOpen && popupOpen.isUpdateOpen) ||
      (!popupOpen.isUpdateOpen && popupOpen.isCreateOpen) ||
      !isOpenConfirm
    ) {
      async function fetchRole() {
        return await roleService.list({});
      }
      setLoading(true);
      fetchRole().then((result) => {
        if (result?.data?.results) {
          const sortedRoles = result?.data?.results.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRole([...sortedRoles]);
        }
      });
      setLoading(false);
    }
  }, [popupOpen, isOpenConfirm]);

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
      console.log("abc:" + result.error);
    }
    setOpen({ isCreateOpen: false, isUpdateOpen: false });
  };

  const handleUpdateRole = async (roleData: IUpdateRoleRequest) => {
    setLoading(true);
    const result = await roleService.update(id!, roleData);
    setLoading(false);
    if (!result.isSuccess) {
      console.log("abc:" + result.error);
    }
    setOpen({ isCreateOpen: false, isUpdateOpen: false });
  };

  const handleDelete = async () => {
    const result = await roleService.delete(id!);
    if (result.isSuccess) {
      setOpenConfirm(false);
    }
  };

  if (loading || isLoading) {
    return <LoadingPage />;
  }

  return (
    <div>
      <div className="space-y-4">
        {/* Header with Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 mt-5 ml-5">
            ROLE MANAGEMENT
          </h2>
        </div>

        {/* Table Container */}
        <div className="p-4 bg-white">
          {/* Add Button aligned to the right */}
          <div className="flex justify-end mb-4">
            <button
              className="bg-brand-primary text-white font-medium px-8 py-2 rounded-lg shadow-sm hover:bg-brand-primary-hover transition"
              onClick={(_) => {
                setOpen({ isUpdateOpen: false, isCreateOpen: true });
                setId(undefined);
              }}
            >
              Add new
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
        popupOpen={popupOpen}
        id={id}
        setOpen={setOpen}
        handleAddRole={handleAddRole}
        handleUpdateRole={handleUpdateRole}
      />

      <ConfirmDialog
        isOpen={isOpenConfirm}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        onConfirm={handleDelete}
        onCancel={() => setOpenConfirm(false)}
      />
    </div>
  );
}
