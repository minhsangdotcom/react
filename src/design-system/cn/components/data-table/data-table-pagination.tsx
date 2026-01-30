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
import { ROW_PER_PAGE } from "@/types/Params";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEYS } from "@/config/translationKey";
interface DataTablePaginationProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  isCursorPaged?: boolean;
  cursorPageInfo?: CursorPageInfo;
  onCursorPageChange?: (
    cursor: string | null,
    direction: "next" | "previous",
  ) => void;
}

export interface CursorPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

const defaultCursorPage = {
  hasNextPage: false,
  hasPreviousPage: false,
  startCursor: null,
  endCursor: null,
} as CursorPageInfo;

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = ROW_PER_PAGE,
  className,
  isCursorPaged = false,
  cursorPageInfo = defaultCursorPage,
  onCursorPageChange,
  ...props
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation();
  const handlePreviousPage = () => {
    if (isCursorPaged && onCursorPageChange && cursorPageInfo) {
      onCursorPageChange(cursorPageInfo.startCursor ?? null, "previous");
    } else {
      table.previousPage();
    }
  };

  const handleNextPage = () => {
    if (isCursorPaged && onCursorPageChange && cursorPageInfo) {
      onCursorPageChange(cursorPageInfo.endCursor ?? null, "next");
    } else {
      table.nextPage();
    }
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8",
        className
      )}
      {...props}
    >
      <div className="flex-1 whitespace-nowrap text-muted-foreground text-sm">
        {t(TRANSLATION_KEYS.common.table.selection.count, {
          selected: table.getFilteredSelectedRowModel().rows.length,
          total: table.getFilteredRowModel().rows.length,
        })}
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap font-medium text-sm">
            {t(TRANSLATION_KEYS.common.table.pagination.rowsPerPage)}
          </p>
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
        {!isCursorPaged && (
          <div className="flex items-center justify-center font-medium text-sm">
            {t(TRANSLATION_KEYS.common.table.pagination.pageOf, {
              current: table.getState().pagination.pageIndex + 1,
              total: table.getPageCount(),
            })}
          </div>
        )}
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
            onClick={handlePreviousPage}
            disabled={
              !(isCursorPaged
                ? cursorPageInfo?.hasPreviousPage
                : table.getCanNextPage())
            }
          >
            <ChevronLeft />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={handleNextPage}
            disabled={
              !(isCursorPaged
                ? cursorPageInfo?.hasNextPage
                : table.getCanNextPage())
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
