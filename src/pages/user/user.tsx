import { DataTable } from "@dscn/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@dscn/components/data-table/data-table-advanced-toolbar";
import { DataTableColumnHeader } from "@dscn/components/data-table/data-table-column-header";
import { DataTableSortList } from "@dscn/components/data-table/data-table-sort-list";
import { Badge } from "@dscn/components/ui/badge";
import { Button } from "@dscn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@dscn/components/ui/dropdown-menu";
import { useDataTable } from "@dscn/hooks/use-data-table";
import { defaultParams } from "@/types/Params";
import { IUser } from "@/types/user/IUser";
import { UserStatus } from "@/types/user/UserStatus";
import { Column, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  CheckCircle,
  CheckCircle2,
  MoreHorizontal,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQueryParam } from "@/hooks/useQueyParam";
import { userService } from "@services/user/userService";
import filterParser from "@utils/queryParams/filterParser";
import { DataTableFilterMenu } from "@dscn/components/data-table/data-table-filter-menu";
import { IPageInfo } from "@/types/IResponse";
import { Checkbox } from "@dscn/components/ui/checkbox";
import localStorageHelper from "@utils/storages/localStorageHelper";
import { Loading } from "@components/Loading";
import { useAppSelector } from "@/store/hook";
dayjs.extend(utc);
dayjs.extend(timezone);
export default function UserPage() {
  const { isLoading } = useAppSelector((store) => store.auth);
  const { query } = useQueryParam();

  const [user, setUser] = useState<Array<IUser>>([]);
  const [pageInfo, setPageInfo] = useState<IPageInfo>();
  const [loading, setLoading] = useState<boolean>();

  const columns = useMemo<ColumnDef<IUser>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
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
        },
        enableColumnFilter: false,
      },
      {
        id: "username",
        accessorKey: "username",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Username" />
        ),
        cell: ({ row }) => <div>{row.getValue("username")}</div>,
        meta: {
          label: "Username",
          placeholder: "Search by Username...",
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "email",
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => <div>{row.getValue("email")}</div>,
        meta: {
          label: "Email",
          placeholder: "Search by Email...",
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "phoneNumber",
        accessorKey: "phoneNumber",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="PhoneNumber" />
        ),
        cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
        meta: {
          label: "PhoneNumber",
          placeholder: "Search by PhoneNumber...",
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "dateOfBirth",
        accessorKey: "dateOfBirth",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Date of birth" />
        ),
        cell: ({ row }) => (
          <div>
            {dayjs
              .utc(row.getValue("dateOfBirth"))
              .tz(dayjs.tz.guess())
              .format("DD/MM/YYYY")}
          </div>
        ),
        meta: {
          label: "Date of birth",
          placeholder: "Search by Date of birth...",
          variant: "date",
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }: { column: Column<IUser, unknown> }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<IUser["status"]>();
          const Icon = status === UserStatus.Active ? CheckCircle2 : XCircle;

          return (
            <Badge variant="outline" className="capitalize">
              <Icon />
              {status === UserStatus.Active ? "Active" : "Inactive"}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: [
            {
              label: "Active",
              value: UserStatus.Active.toString(),
              icon: CheckCircle,
            },
            {
              label: "Inactive",
              value: UserStatus.Inactive.toString(),
              icon: XCircle,
            },
          ],
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

  const { table } = useDataTable({
    data: user ?? [],
    columns,
    pageCount: pageInfo?.totalPage ?? 0,
    initialState: {
      sorting: defaultParams.sort,
      pagination: {
        pageSize: defaultParams.perPage!,
        pageIndex: 0,
      },
    },
    getRowId: (row: any) => row.id,
  });

  useEffect(() => {
    if (query == undefined) {
      return;
    }
    console.log("🚀 ~ useEffect ~ query:", query);

    const params = filterParser.parse(query ?? {});
    setLoading(true);
    userService
      .list(params)
      .then((result) => {
        const data = result?.data?.results?.data as Array<IUser>;
        const paging = result?.data?.results?.paging as IPageInfo;
        setUser([...new Set(data)]);
        setPageInfo({ ...paging });
        localStorageHelper.set("paginationInfo", {
          previous: paging.before,
          next: paging.after,
          hasNextPage: paging.hasNextPage,
          hasPreviousPage: paging.hasPreviousPage,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  if (isLoading || loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="space-y-4">
        {/* Header with Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 mt-5 ml-5">
            User
          </h2>
        </div>

        {/* Table Container */}
        <div className="p-4 bg-white">
          {/* Add Button aligned to the right */}
          <div className="flex justify-end mb-4">
            <button className="bg-brand-primary text-white font-medium px-8 py-2 rounded-lg shadow-sm hover:bg-brand-primary-hover transition">
              Create new
            </button>
          </div>

          <DataTable table={table} isCursorPaged={true}>
            <DataTableAdvancedToolbar table={table}>
              <DataTableFilterMenu table={table} />
              <DataTableSortList table={table} />
            </DataTableAdvancedToolbar>
          </DataTable>
        </div>
      </div>
    </div>
  );
}
