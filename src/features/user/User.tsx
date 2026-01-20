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
import {
  IPermissionModel,
  IRoleModel,
  IUser,
  IUserResponse,
} from "@/features/user/IUser";
import { UserStatus } from "@/features/user/UserStatus";
import { Column, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { CheckCircle, MoreHorizontal, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryParam } from "@/hooks/useQueyParam";
import { userService } from "@/features/user/userService";
import filterParser from "@utils/queryParams/filterParser";
import { IPageInfo, IPagination } from "@/types/IResponse";
import { Checkbox } from "@dscn/components/ui/checkbox";
import localStorageHelper from "@utils/storages/localStorageHelper";
import { DataTableFilterMenu } from "@/design-system/cn/components/data-table/data-table-filter-menu";
import SearchBar from "@components/SearchBar";
import CreateUserModal from "./CreateUserModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import UpdateUserModal from "./UpdateUserModal";
import IQueryParam from "@/types/IQueryParam";
import { roleService } from "@features/role/roleService";
import permissionService from "@/services/permission/permissionService";
import { IPermissionGroupResponse } from "@/types/permission/IPermission";
import { IRole } from "../role/IRole";
import { Loading } from "@/components/Loading";
import { defaultAvatarPicker } from "@/utils/defaultAvatarPicker";
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
  const [refDataLoading, setRefDataLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [openCreatePopup, setOpenCreatePopup] = useState<boolean>(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState<boolean>(false);
  const [openConfirmDialog, setConfirmDialogOpen] = useState<boolean>(false);
  const [id, setId] = useState<string | null>(null);

  const [permissions, setPermissions] = useState<IPermissionModel[]>([]);
  const [roles, setRoles] = useState<IRoleModel[]>([]);

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
        cell: ({ row }) => {
          return (
            <div className="text-gray-500">@{row.getValue("username")}</div>
          );
        },
        meta: {
          label: "Username",
          placeholder: "Search by Username...",
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "fullName",
        accessorKey: "fullName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Full Name" />
        ),
        cell: ({ row }) => {
          const avatarUrl =
            row.original.avatar ??
            defaultAvatarPicker.getAvatar(row.original.gender);
          return (
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt="fullName"
                className="h-8 w-8 rounded-full object-cover"
              />

              <span className="text-sm font-medium text-gray-900">
                {row.original.firstName} {row.original.lastName}
              </span>
            </div>
          );
        },
        meta: {
          label: "Full Name",
          placeholder: "Search by Full Name...",
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
        cell: ({ row }) => {
          const phoneNumber: string = row.getValue("phoneNumber");
          return <div>{phoneNumber ? phoneNumber : "_"}</div>;
        },
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
        cell: ({ row }) => {
          const dateOfBirth: string = row.getValue("dateOfBirth");
          return (
            <div>
              {dateOfBirth
                ? dayjs
                    .utc(dateOfBirth)
                    .tz(dayjs.tz.guess())
                    .format("DD/MM/YYYY")
                : "_"}
            </div>
          );
        },
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
          return (
            <Badge
              className={`rounded-sm px-4 py-1 text-xs font-medium ${
                statusStyles[UserStatus[status]]
              }`}
            >
              {UserStatus[status]}
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
                    setOpenUpdatePopup(true);
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
      columnVisibility: {
        id: false,
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
    if (
      query === undefined ||
      openCreatePopup ||
      openUpdatePopup ||
      openConfirmDialog
    ) {
      return;
    }
    const params = filterParser.parse(query as Params);
    convertFullNameToFirstLastNameFilter(params);
    if (search !== "") {
      params.keyword = search;
      params.targets = [
        "username",
        "firsName",
        "lastName",
        "email",
        "phoneNumber",
      ];
    }
    setLoading(true);
    userService
      .list(params)
      .then((results) => {
        const { data, paging } = results.data?.results as IPagination<
          IUserResponse[]
        >;
        const users = data.map((user) => toIUser(user));

        setUser([...new Set([...users])]);
        setPageInfo({ ...paging });
        localStorageHelper.set("paginationInfo", {
          previous: paging?.before ?? "",
          next: paging?.after ?? "",
          hasNextPage: paging?.hasNextPage,
          hasPreviousPage: paging?.hasPreviousPage,
        });
      })
      .catch((error) => {
        //
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query, search, openCreatePopup, openConfirmDialog, openUpdatePopup]);

  const referenceDataRef = useRef<boolean>(false);
  useEffect(() => {
    if (referenceDataRef.current) {
      return;
    }
    loadReferenceData();
    referenceDataRef.current = true;
  }, []);

  async function loadReferenceData() {
    setRefDataLoading(true);
    try {
      const [roleResult, permissionResult] = await Promise.all([
        roleService.list({}),
        permissionService.list(),
      ]);
      const rolesData = roleResult.data?.results as IRole[];
      setRoles(rolesData.map((x) => ({ id: x.id, name: x.name })));

      const groups = permissionResult.data
        ?.results as IPermissionGroupResponse[];
      const permissionsData = groups
        .flatMap((group) => group.permissions)
        .map((per) => ({ id: per.id, code: per.codeTranslation }));
      setPermissions(permissionsData);
    } catch (error) {
      console.error("Failed to load reference data:", error);
    } finally {
      setRefDataLoading(false);
    }
  }

  async function handleConfirm() {
    setLoading(true);
    try {
      await userService.delete(id!);
    } catch (error) {
      //
    } finally {
      setLoading(false);
      setConfirmDialogOpen(false);
    }
  }

  if (refDataLoading) {
    return (
      <div className="p-3 min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="p-3 min-h-screen">
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
          onClick={() => setOpenCreatePopup(true)}
        >
          Create new
        </button>

        {/* {table} */}
        <DataTable table={table} isCursorPaged={true} loading={loading}>
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
      <CreateUserModal
        open={openCreatePopup}
        onRequestClose={() => setOpenCreatePopup(false)}
        roles={roles}
        permissions={permissions}
      />
      <UpdateUserModal
        open={openUpdatePopup}
        onRequestClose={() => setOpenUpdatePopup(false)}
        roles={roles}
        permissions={permissions}
        userId={id!}
      />
      <ConfirmDialog
        isOpen={openConfirmDialog}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDialogOpen(false)}
      />
    </>
  );
}

const convertFullNameToFirstLastNameFilter = (params: IQueryParam): void => {
  if (
    typeof params.filter === "object" &&
    params.filter !== null &&
    "fullName" in params.filter
  ) {
    const value = (params.filter?.fullName as any)["$containsi"];
    params.filter = {
      ...params.filter,
      $or: [
        { firstName: { $containsi: value } },
        { lastName: { $containsi: value } },
      ],
    };

    delete params.filter?.fullName;
  }

  const andFilters = params.filter?.["$and"];
  if (params.filter != null && Array.isArray(andFilters)) {
    const index = andFilters.findIndex(
      (item) => typeof item === "object" && item !== null && "fullName" in item
    );

    if (index !== -1) {
      const filters = andFilters.filter(
        (item) =>
          typeof item === "object" && item !== null && !("fullName" in item)
      );
      const fullName = andFilters[index].fullName as any;
      params.filter["$and"] = [
        ...filters,
        {
          $or: [
            { firstName: { $containsi: fullName["$containsi"] } },
            { lastName: { $containsi: fullName["$containsi"] } },
          ],
        },
      ];
    }
  }
};
const statusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 border border-emerald-200",

  Inactive: "bg-gray-100 text-gray-600 border border-gray-200",

  Suspended: "bg-red-100 text-red-700 border border-red-200",
};
