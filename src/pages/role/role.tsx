import { DataTableColumnHeader } from "@/src/components/data-table/data-table-column-header";
import { useDataTable } from "@/src/hooks/use-data-table";
import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { roleService } from "@/src/services/roles/roleService";
import { IRole } from "@/src/types/role/IRole";
import { useAuth } from "@/src/hooks/useAuth";
import { DataTable } from "@/src/components/data-table/data-table";
import "./role.css";

import LoadingPage from "@/src/components/loading";
import { useQueryParam } from "@/src/hooks/useQueyParam";
import filterParser from "@/src/utils/queryParams/filterParser";
import { defaultParams } from "@/src/types/Params";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import AddRoleModal from "@/src/components/popup/roleFormModal";
import { Dialog } from "@/src/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

export default function RolePage() {
  const { isLoading } = useAuth();
  const [role, setRole] = useState<Array<IRole>>();
  const { query } = useQueryParam();

  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState(false);
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
        id: "guard",
        accessorKey: "guard",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Guard" />
        ),
        cell: ({ row }) => <div>{row.getValue("guard")}</div>,
        meta: {
          label: "Guard",
          placeholder: "Search by description...",
          variant: "text",
          //icon: Text ,
        },
        enableColumnFilter: true,
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
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
        cell: function Cell() {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="focus:outline-none focus:ring-0 focus:ring-offset-0"
                >
                  <MoreHorizontal className="h-4 w-4 text-dark-600 dark:text-dark-300" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={4}
                className="min-w-[140px] bg-white dark:bg-800 rounded-lg shadow-lg p-1 z-100 cursor-pointer border-0"
              >
                <DropdownMenuItem>Edit</DropdownMenuItem>

                <DropdownMenuItem variant="destructive">
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
    async function fetchRole() {
      return await roleService.list(filterParser.parse(query!));
    }
    setLoading(true);
    fetchRole().then((result) => {
      if (result?.data?.results) setRole([...result?.data?.results]);
    });
    setLoading(false);
  }, [query]);

  const { table } = useDataTable({
    data: role ?? [
      {
        id: "123",
        name: "abc",
        description: "aaa",
        guard: "gggg",
        isActive: false,
        price: 50,
      },
    ],
    columns,
    pageCount: role?.length ?? 100,
    initialState: {
      sorting: defaultParams.sort,
      pagination: {
        pageSize: defaultParams.perPage,
        pageIndex: defaultParams.page,
      },
    },
    getRowId: (row: any) => row.id,
  });

  const handleAddRole = (e: any) => {
    console.log("hello");
  };

  if (loading && isLoading) {
    return <LoadingPage />;
  }

  return (
    <Dialog>
      <div className="space-y-4">
        {/* Header with Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 mt-5 ml-5">
            Role table
          </h2>
        </div>

        {/* Table Container */}
        <div className="custom-table p-4 bg-white rounded-xl shadow-md">
          {/* Add Button aligned to the right */}
          <DialogTrigger asChild>
            <div className="flex justify-end mb-4">
              <button
                className="bg-blue-300 text-white font-medium px-8 py-2 rounded-lg shadow-sm hover:bg-blue-500 transition"
                onClick={() => setModalOpen(true)}
              >
                Add new
              </button>
            </div>
          </DialogTrigger>

          <DataTable
            table={table}
            className="w-full text-sm text-left text-gray-700"
            hasPagination={false}
          />
        </div>
      </div>
      <AddRoleModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddRole}
      />
    </Dialog>
  );
}
