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
import { defaultParams, Params } from "@/types/Params";
import { IUser, IUserResponse } from "@/features/user/IUser";
import { UserStatus } from "@/features/user/UserStatus";
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
import { userService } from "@/features/user/userService";
import filterParser from "@utils/queryParams/filterParser";
import { IPageInfo } from "@/types/IResponse";
import { Checkbox } from "@dscn/components/ui/checkbox";
import localStorageHelper from "@utils/storages/localStorageHelper";
import { DataTableFilterMenu } from "@/design-system/cn/components/data-table/data-table-filter-menu";
import SearchBar from "@components/SearchBar";
import CreateUserPopup from "./CreateUserPopup";
import { ConfirmDialog } from "@/components/ConfirmDialog";
dayjs.extend(utc);
dayjs.extend(timezone);

function toIUser(dto: IUserResponse): IUser {
  return {
    id: dto.id,
    username: dto.username,
    email: dto.email,

    firstName: dto.firstName ?? "",
    lastName: dto.lastName ?? "",
    phoneNumber: dto.phoneNumber ?? "",

    password: "",

    dateOfBirth: dto.dateOfBirth ?? "",
    gender: dto.gender ?? null,
    avatar: dto.avatar ?? null,
    status: dto.status,
    createdAt: new Date(dto.createdAt),
    roles: [],
    permissions: [],
  };
}

export default function User() {
  const { query } = useQueryParam();

  const [user, setUser] = useState<Array<IUser>>([]);
  const [pageInfo, setPageInfo] = useState<IPageInfo>();
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [openConfirmDialog, setConfirmDialogOpen] = useState<boolean>(false);
  const [id, setId] = useState<string | null>(null);

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
        cell: ({ row }) => {
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />;
        },
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
        enableColumnFilter: false,
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
                  onClick={() => {
                    setId(row.getValue("id"));
                  }}
                >
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setId(row.getValue("id"));
                    setConfirmDialogOpen(true);
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

  // useDataFilterList(
  //   query,
  //   () => {
  //     const params = filterParser.parse(query as Params);
  //     if (search !== "") {
  //       params.keyword = search;
  //     }
  //     setLoading(true);
  //     userService
  //       .list(params)
  //       .then((result) => {
  //         const data = result?.data?.results?.data as Array<IUser>;
  //         const paging = result?.data?.results?.paging as IPageInfo;
  //         setUser([...new Set(data)]);
  //         setPageInfo({ ...paging });
  //         localStorageHelper.set("paginationInfo", {
  //           previous: paging?.before ?? "",
  //           next: paging?.after ?? "",
  //           hasNextPage: paging?.hasNextPage,
  //           hasPreviousPage: paging?.hasPreviousPage,
  //         });
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   },
  //   [search]
  // );

  useEffect(() => {
    if (query === undefined || open || openConfirmDialog) {
      return;
    }
    const params = filterParser.parse(query as Params);
    if (search !== "") {
      params.keyword = search;
    }
    setLoading(true);
    userService
      .list(params)
      .then((result) => {
        if (!result.data?.results) {
          return;
        }
        const { data, paging } = result.data.results;
        const users = data.map((x) => toIUser(x));

        setUser([...new Set([...users])]);
        setPageInfo({ ...paging });
        localStorageHelper.set("paginationInfo", {
          previous: paging?.before ?? "",
          next: paging?.after ?? "",
          hasNextPage: paging?.hasNextPage,
          hasPreviousPage: paging?.hasPreviousPage,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query, search, open, openConfirmDialog]);

  async function handleDelete(): Promise<void> {
    setLoading(true);
    await userService.delete(id as string);
    setLoading(false);
    setConfirmDialogOpen(false);
  }

  return (
    <div>
      <div className="p-3 h-screen md:h-[calc(100vh-64px)]">
        {/*Title */}
        <h1 className="text-xl font-semibold text-gray-800 mt-3 ml-2">User</h1>

        {/* Actions */}
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
          onClick={() => setOpen(true)}
        >
          Create new
        </button>

        {/* {table} */}
        <DataTable table={table} isCursorPaged={true} isloading={loading}>
          <DataTableAdvancedToolbar table={table}>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search anything..."
              className="w-full sm:max-w-xs"
              inputClassName="max-sm:h-11 h-9 py-2 text-sm border border-gray-200 bg-white hover:bg-gray-100 focus:bg-gray-100"
            />

            <DataTableFilterMenu table={table} />
            <DataTableSortList table={table} />
          </DataTableAdvancedToolbar>
        </DataTable>
      </div>
      <CreateUserPopup open={open} setOpen={setOpen} />
      <ConfirmDialog
        isOpen={openConfirmDialog}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialogOpen(false)}
      />
    </div>
  );
}
