import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@dscn/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dscn/components/ui/select";
import { cn } from "@dscn/lib/utils";
import { localStorageUtil } from "@/utils/storages/localStorageUtil";
import queryString from "query-string";
import { Params } from "@/types/Params";
interface DataTablePaginationProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  isCursorPaged?: boolean;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className,
  isCursorPaged = false,
  ...props
}: DataTablePaginationProps<TData>) {
  let pageInfo = null;
  let query = {} as Params | any;
  if (isCursorPaged) {
    query = queryString.parse(window.location.search) as Params | any;
    pageInfo = getCursorPagedInfo();
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8",
        className
      )}
      {...props}
    >
      <div className="flex-1 whitespace-nowrap text-muted-foreground text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap font-medium text-sm">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[4.5rem] [&[data-size]]:h-8">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center font-medium text-sm">
          Page{" "}
          {isCursorPaged
            ? (query.page ?? 1)
            : table.getState().pagination.pageIndex + 1}{" "}
          of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          {!isCursorPaged && (
            <Button
              aria-label="Go to first page"
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft />
            </Button>
          )}
          <Button
            aria-label="Go to previous page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => {
              if (!isCursorPaged) {
                table.previousPage();
                return;
              }
              const params = new URLSearchParams(window.location.search);
              params.set("previous", pageInfo?.previous ?? "");
              params.delete("next");
              let currentPage = query.page ?? 1;
              params.set("page", (currentPage - 1).toString());
              const newUrl = `${window.location.pathname}?${params.toString()}`;
              window.history.replaceState({}, "", newUrl);
            }}
            disabled={
              isCursorPaged
                ? !pageInfo?.hasPreviousPage
                : !table.getCanPreviousPage()
            }
          >
            <ChevronLeft />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => {
              if (!isCursorPaged) {
                table.nextPage();
                return;
              }
              const params = new URLSearchParams(window.location.search);
              const pageInfo = localStorageUtil.get<{
                previous: string;
                next: string;
              }>("paginationInfo");
              params.set("next", pageInfo?.next ?? "");
              params.delete("previous");
              let currentPage = query.page ?? 1;
              params.set("page", (++currentPage).toString());
              const newUrl = `${window.location.pathname}?${params.toString()}`;
              window.history.replaceState({}, "", newUrl);
            }}
            disabled={
              isCursorPaged ? !pageInfo?.hasNextPage : !table.getCanNextPage()
            }
          >
            <ChevronRight />
          </Button>
          {!isCursorPaged && (
            <Button
              aria-label="Go to last page"
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function getCursorPagedInfo() {
  return localStorageUtil.get<{
    previous: string;
    next: string;
    hasNextPage: number;
    hasPreviousPage: number;
  }>("paginationInfo");
}
