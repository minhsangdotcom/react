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
import { defaultParams } from "@/types/FilterParam";
import {
  IPermissionModel,
  IRoleModel,
  IUser,
  IUserResponse,
} from "@/features/user/IUser";
import getStatusTranslation, { UserStatus } from "@/features/user/UserStatus";
import { Column, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { CheckCircle, MoreHorizontal, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQueryParam } from "@/hooks/useQueyParam";
import { userService } from "@/features/user/userService";
import { IPageInfo, IPagination } from "@/types/IResponse";
import { Checkbox } from "@dscn/components/ui/checkbox";
import { DataTableFilterMenu } from "@/design-system/cn/components/data-table/data-table-filter-menu";
import SearchBar from "@components/SearchBar";
import CreateUserModal from "./CreateUserModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import UpdateUserModal from "./UpdateUserModal";
import { QueryString } from "@/types/IQueryString";
import { roleService } from "@features/role/roleService";
import permissionService from "@/services/permission/permissionService";
import { IPermissionGroupResponse } from "@/types/permission/IPermission";
import { IRole } from "../role/IRole";
import { Loading } from "@/components/Loading";
import { defaultAvatarPicker } from "@/utils/defaultAvatarPicker";
import { showSuccessToast } from "@/notifications/toastSuccess";
import { useAppSelector } from "@/store/hook";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEYS } from "@/config/translationKey";
import { Avatar, AvatarImage } from "@/design-system/cn/components/ui/avatar";
import { DELIMITER } from "@/utils/queryParams/sort";
import {
  CursorPageInfo,
  DataCursorPagination,
  DataTablePagination,
  EllipsisPagination,
} from "@/design-system/cn/components/data-table/data-table-pagination";
import { sanitizeQuery } from "@/utils/queryParams/sanitizeQuery";
import { sanitizeSearchQuery } from "@/utils/queryParams/sanitizeSearchQuery";
import { UserCard } from "./UserCard";
import { vi, enUS } from "date-fns/locale";
import { parseDateTime } from "@/utils/dateFormat";
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
    createdAt: dto.createdAt,
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
  const [expand, setExpand] = useState<string[]>([]);

  const { code } = useAppSelector((store) => store.language);
  const { t } = useTranslation();

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
        enableSorting: false,
      },
      {
        id: "username",
        accessorKey: "username",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            id="username"
            title={t(TRANSLATION_KEYS.user.table.fields.username)}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="text-gray-500">@{row.getValue("username")}</div>
          );
        },
        meta: {
          label: t(TRANSLATION_KEYS.user.table.filter.items.username.label),
          placeholder: t(
            TRANSLATION_KEYS.user.table.filter.items.username.placeholder
          ),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "fullName",
        accessorKey: "fullName",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            id="fullName"
            title={t(TRANSLATION_KEYS.user.table.fields.fullName)}
          />
        ),
        cell: ({ row }) => {
          const avatarUrl =
            row.original.avatar ??
            defaultAvatarPicker.getAvatar(row.original.gender);
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage
                  src={avatarUrl}
                  className="w-full h-full object-cover"
                />
              </Avatar>

              <span className="text-sm font-medium text-gray-900">
                {row.original.firstName} {row.original.lastName}
              </span>
            </div>
          );
        },
        meta: {
          label: t(TRANSLATION_KEYS.user.table.filter.items.fullName.label),
          placeholder: t(
            TRANSLATION_KEYS.user.table.filter.items.fullName.placeholder
          ),
          variant: "text",
        },
        enableColumnFilter: true,
        enableSorting: true,
      },
      {
        id: "email",
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            id="email"
            title={t(TRANSLATION_KEYS.user.table.fields.email)}
          />
        ),
        cell: ({ row }) => <div>{row.getValue("email")}</div>,
        meta: {
          label: t(TRANSLATION_KEYS.user.table.filter.items.email.label),
          placeholder: t(
            TRANSLATION_KEYS.user.table.filter.items.email.placeholder
          ),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "phoneNumber",
        accessorKey: "phoneNumber",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            id="phoneNumber"
            title={t(TRANSLATION_KEYS.user.table.fields.phoneNumber)}
          />
        ),
        cell: ({ row }) => {
          const phoneNumber: string = row.getValue("phoneNumber");
          return <div>{phoneNumber ? phoneNumber : "_"}</div>;
        },
        meta: {
          label: t(TRANSLATION_KEYS.user.table.filter.items.phoneNumber.label),
          placeholder: t(
            TRANSLATION_KEYS.user.table.filter.items.phoneNumber.placeholder
          ),
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "dateOfBirth",
        accessorKey: "dateOfBirth",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            id="dateOfBirth"
            title={t(TRANSLATION_KEYS.user.table.fields.dateOfBirth)}
          />
        ),
        cell: ({ row }) => {
          const dateOfBirth: string = row.getValue("dateOfBirth");
          return (
            <>{dateOfBirth ? parseDateTime(dateOfBirth, "DD/MM/YYYY") : "_"}</>
          );
        },
        meta: {
          label: t(TRANSLATION_KEYS.user.table.filter.items.dateOfBirth.label),
          placeholder: t(
            TRANSLATION_KEYS.user.table.filter.items.dateOfBirth.placeholder
          ),
          variant: "date",
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }: { column: Column<IUser, unknown> }) => (
          <DataTableColumnHeader
            column={column}
            id="status"
            title={t(TRANSLATION_KEYS.user.table.fields.status)}
          />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<IUser["status"]>();
          return (
            <Badge
              className={`rounded-sm px-4 py-1 text-xs font-medium ${
                statusStyles[UserStatus[status]]
              }`}
            >
              {t(getStatusTranslation(status as UserStatus) as any)}
            </Badge>
          );
        },
        meta: {
          label: t(TRANSLATION_KEYS.user.table.filter.items.status.label),
          variant: "multiSelect",
          options: [
            {
              label: t(TRANSLATION_KEYS.user.status.active),
              value: UserStatus.Active.toString(),
              icon: CheckCircle,
            },
            {
              label: t(TRANSLATION_KEYS.user.status.inactive),
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
          <DataTableColumnHeader
            column={column}
            id="createdAt"
            title={t(TRANSLATION_KEYS.common.table.fields.createdAt)}
          />
        ),
        cell: ({ row }) => {
          const createdAt: string = row.getValue("createdAt");
          return <>{parseDateTime(createdAt, "DD/MM/YYYY")}</>;
        },
        meta: {
          label: t(TRANSLATION_KEYS.common.table.fields.createdAt),
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
                  {t(TRANSLATION_KEYS.common.actions.edit)}
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setId(row.getValue("id"));
                    setConfirmDialogOpen(true);
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
    data: user,
    columns,
    pageCount: pageInfo?.totalPage ?? 0,
    initialState: {
      sorting: [...defaultParams.sort],
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
  //         localStorageUtil.set("paginationInfo", {
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
    const queryParam = sanitizeQuery(
      query,
      (queryString) => sanitizeInputFilter(queryString),
      (queryString) => sanitizeInputSort(queryString)
    );
    sanitizeSearchQuery(queryParam, search, [
      "username",
      "firsName",
      "lastName",
      "email",
      "phoneNumber",
    ]);
    getUsers(queryParam);
  }, [query, search, openCreatePopup, openConfirmDialog, openUpdatePopup]);

  async function getUsers(params: QueryString) {
    setLoading(true);
    const result = await userService.list(params);
    if (result.success) {
      const { data, paging } = result.data?.results as IPagination<
        IUserResponse[]
      >;
      const users = data.map((user) => toIUser(user));

      setUser([...new Set([...users])]);
      setPageInfo({ ...paging });
    }

    setLoading(false);
  }

  useEffect(() => {
    // used to cancel second call of the api in react strict mode
    const controller = new AbortController();
    loadReferenceData(controller.signal);
    return () => {
      controller.abort();
    };
  }, [code]);

  async function loadReferenceData(signal: AbortSignal) {
    setRefDataLoading(true);
    const [roleResult, permissionResult] = await Promise.all([
      roleService.list({}, signal),
      permissionService.list(signal),
    ]);

    if (roleResult.success && permissionResult.success) {
      const roles = roleResult.data?.results as IRole[];
      setRoles(roles.map((role) => ({ id: role.id, name: role.name })));

      const groups = permissionResult.data
        ?.results as IPermissionGroupResponse[];
      const rootedPermissionGroup = groups
        .flatMap((group) => group.permissions)
        .map((per) => ({ id: per.id, code: per.codeTranslation }));
      setPermissions(rootedPermissionGroup);
    }
    setRefDataLoading(false);
  }

  async function handleConfirm() {
    setLoading(true);
    await userService.delete(id!);
    setLoading(false);
    setConfirmDialogOpen(false);
  }

  if (refDataLoading) {
    return (
      <div className="px-4 h-[calc(100vh-64px)]">
        <Loading />
      </div>
    );
  }

  const onSubmit = (message: string) => showSuccessToast(message);

  const handleCursorPageChange = async (
    cursor: string | null,
    direction: "next" | "previous"
  ) => {
    if (query == undefined) {
      return;
    }
    const queryParam = sanitizeQuery(
      query,
      (queryString) => sanitizeInputFilter(queryString),
      (queryString) => sanitizeInputSort(queryString)
    );

    if (direction == "next") {
      queryParam.after = cursor;
    }
    if (direction == "previous") {
      queryParam.before = cursor;
    }
    getUsers(queryParam);
  };

  const pagination = () => {
    return (
      <EllipsisPagination
        table={table}
        config={{
          boundaryCount: 1,
          maxVisiblePages: 7,
          siblingCount: 1,
        }}
      />
    );
  };

  return (
    <>
      <div className="flex flex-col gap-1 p-4 md:p-6 w-full">
        {/*Title */}
        <h1 className="text-xl font-semibold text-gray-800 py-3">
          {t(TRANSLATION_KEYS.user.title)}
        </h1>
        {/* Actions */}
        <div className="flex justify-end px-2">
          <button
            className="cursor-pointer rounded-lg shadow-sm bg-brand-primary text-white font-medium px-6 py-2 text-base w-full my-2 transition-colors duration-200 hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 active:scale-[0.98] md:w-auto md:my-0"
            onClick={() => setOpenCreatePopup(true)}
          >
            {t(TRANSLATION_KEYS.common.actions.create)}
          </button>
        </div>
        <div className="px-1">
          {/*
          Toolbar
          */}
          <DataTableAdvancedToolbar table={table} className="py-2">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder={t(
                TRANSLATION_KEYS.common.table.toolbar.search.placeholder
              )}
              className="w-full md:w-xs"
              inputClassName="max-sm:h-11 h-9 py-2 text-sm border border-gray-200 bg-white"
            />
            <DataTableFilterMenu
              table={table}
              calendarLocale={[enUS, vi].find((x) => x.code == code)!}
            />
            <DataTableSortList table={table} />
          </DataTableAdvancedToolbar>
          {/* {table} */}
          <div className="flex flex-col h-[calc(100vh-200px)]">
            <div className="md:hidden">
              {user.map((user, index) => (
                <div
                  className="flex flex-col"
                  key={`${index}-${user.username}`}
                >
                  <UserCard
                    key={`${index}-${user.username}`}
                    user={user}
                    isExpanded={expand.includes(user.id)}
                    onToggle={(id) => {
                      setId(id);
                      setExpand((pre) =>
                        pre.includes(id)
                          ? pre.filter((x) => x != id)
                          : [...pre, id]
                      );
                    }}
                    onDelete={(id) => {
                      setId(id);
                      setConfirmDialogOpen(true);
                    }}
                    onEdit={() => setOpenUpdatePopup(true)}
                  />
                </div>
              ))}
              {pagination()}
            </div>
            <div className="hidden md:block">
              <DataTable
                table={table}
                loading={loading}
                pagination={
                  pagination()
                  // <DataTablePagination table={table} />
                  // <DataCursorPagination
                  //   table={table}
                  //   cursorPageInfo={{
                  //     hasNextPage: pageInfo?.hasNextPage!,
                  //     hasPreviousPage: pageInfo?.hasPreviousPage!,
                  //     endCursor: pageInfo?.after,
                  //     startCursor: pageInfo?.before,
                  //   }}
                  //   onCursorPageChange={handleCursorPageChange}
                  // />
                }
              />
            </div>
          </div>
        </div>
      </div>
      <CreateUserModal
        language={code}
        open={openCreatePopup}
        onRequestClose={() => setOpenCreatePopup(false)}
        roles={roles}
        permissions={permissions}
        onSubmit={() =>
          onSubmit(
            t(TRANSLATION_KEYS.common.notification.action.success.create, {
              entity: t(TRANSLATION_KEYS.user.entity),
            })
          )
        }
      />
      <UpdateUserModal
        language={code}
        open={openUpdatePopup}
        onRequestClose={() => setOpenUpdatePopup(false)}
        onSubmit={() =>
          onSubmit(
            t(TRANSLATION_KEYS.common.notification.action.success.update, {
              entity: t(TRANSLATION_KEYS.user.entity),
            })
          )
        }
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

function getFilterOperator(obj: unknown): {
  operator: string | null;
  value: any;
} {
  if (typeof obj !== "object" || obj === null) {
    return { operator: null, value: null };
  }

  const entries = Object.entries(obj);

  if (entries.length === 0) {
    return { operator: null, value: null };
  }

  const [operator, value] = entries[0];

  if (!operator.startsWith("$")) {
    return { operator: null, value: null };
  }

  return { operator, value };
}

const sanitizeInputFilter = (params: QueryString): void => {
  if (!params.filter) {
    return;
  }

  if (
    typeof params.filter === "object" &&
    params.filter !== null &&
    "fullName" in params.filter
  ) {
    const { operator, value } = getFilterOperator(params.filter.fullName);
    params.filter = {
      ...params.filter,
      $or: [
        { firstName: { [operator as string]: value } },
        { lastName: { [operator as string]: value } },
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
      const { operator, value } = getFilterOperator(fullName);
      params.filter["$and"] = [
        ...filters,
        {
          $or: [
            { firstName: { [operator as string]: value } },
            { lastName: { [operator as string]: value } },
          ],
        },
      ];
    }
  }
};
const sanitizeInputSort = (params: QueryString): void => {
  const index = params.sort?.indexOf("fullName") ?? -1;
  if (index == -1) {
    return;
  }
  const fullNameSort = params.sort?.substring(index);
  const sorts = fullNameSort?.split(DELIMITER) ?? [];
  if (sorts.length == 0) {
    throw new Error("Invalid sort format");
  }

  const orderBy = sorts[1] ?? "";
  params.sort = params.sort?.replace(
    fullNameSort!,
    `firstName${orderBy === "" ? `${orderBy}` : `${DELIMITER}${orderBy}`},lastName${orderBy === "" ? `${orderBy}` : `${DELIMITER}${orderBy}`}`
  );
};
const statusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 border border-emerald-200",

  Inactive: "bg-gray-100 text-gray-600 border border-gray-200",

  Suspended: "bg-red-100 text-red-700 border border-red-200",
};
