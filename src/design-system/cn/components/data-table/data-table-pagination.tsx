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
import { ROW_PER_PAGE } from "@/types/QueryParam";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEYS } from "@/config/translationKey";
import { useMemo } from "react";

interface DataTablePaginationProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  pageSizeOptions?: number[];
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

interface DataCursorPaginationProps<
  TData,
> extends DataTablePaginationProps<TData> {
  cursorPageInfo: CursorPageInfo;
  onCursorPageChange: (
    cursor: string | null,
    direction: "next" | "previous"
  ) => void;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = ROW_PER_PAGE,
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation();

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
        <div className="flex items-center justify-center font-medium text-sm">
          {t(TRANSLATION_KEYS.common.table.pagination.pageOf, {
            current: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount(),
          })}
        </div>
        <div className="flex items-center space-x-2">
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

          <Button
            aria-label="Go to previous page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>

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
        </div>
      </div>
    </div>
  );
}

export function DataCursorPagination<TData>({
  table,
  pageSizeOptions = ROW_PER_PAGE,
  className,
  cursorPageInfo = defaultCursorPage,
  onCursorPageChange,
  ...props
}: DataCursorPaginationProps<TData>) {
  const { t } = useTranslation();
  const handlePreviousPage = () => {
    onCursorPageChange(cursorPageInfo.startCursor ?? null, "previous");
  };

  const handleNextPage = () => {
    onCursorPageChange(cursorPageInfo.endCursor ?? null, "next");
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

        <div className="flex items-center space-x-2">
          <Button
            aria-label="Go to previous page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={handlePreviousPage}
            disabled={!cursorPageInfo?.hasPreviousPage}
          >
            <ChevronLeft />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={handleNextPage}
            disabled={!cursorPageInfo?.hasNextPage}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface EllipsisPaginationProps<
  TData,
> extends DataTablePaginationProps<TData> {
  config?: PaginationConfig;
}

export type PaginationConfig = {
  maxVisiblePages: number; // Max pages to show before using ellipsis
  siblingCount: number; // Number of pages to show on each side of current page
  boundaryCount: number; // Number of pages to show at start and end
};

// Pagination component
export function EllipsisPagination<TData>({
  table,
  pageSizeOptions = ROW_PER_PAGE,
  className,
  config = {
    boundaryCount: 1,
    maxVisiblePages: 7,
    siblingCount: 1,
  },
  ...props
}: EllipsisPaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const { t } = useTranslation();

  const { maxVisiblePages, siblingCount, boundaryCount } = config;

  function pages(): (number | string)[] {
    const pages: (number | string)[] = [];

    // If total pages is less than or equal to max visible, show all
    if (totalPages <= maxVisiblePages!) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Calculate ranges
    const leftSiblingIndex = Math.max(
      currentPage - siblingCount,
      boundaryCount + 1
    );
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages - boundaryCount
    );

    const shouldShowLeftEllipsis = leftSiblingIndex > boundaryCount + 2;
    const shouldShowRightEllipsis =
      rightSiblingIndex < totalPages - boundaryCount - 1;

    // Add boundary pages at the start
    for (let i = 1; i <= boundaryCount; i++) {
      pages.push(i);
    }

    // Add left ellipsis
    if (shouldShowLeftEllipsis) {
      pages.push("...");
    } else if (boundaryCount + 1 < leftSiblingIndex) {
      // Fill gap between boundary and siblings
      for (let i = boundaryCount + 1; i < leftSiblingIndex; i++) {
        pages.push(i);
      }
    }

    // Add sibling pages around current page
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pages.push(i);
    }

    // Add right ellipsis
    if (shouldShowRightEllipsis) {
      pages.push("...");
    } else if (rightSiblingIndex < totalPages - boundaryCount) {
      // Fill gap between siblings and boundary
      for (
        let i = rightSiblingIndex + 1;
        i < totalPages - boundaryCount + 1;
        i++
      ) {
        pages.push(i);
      }
    }

    // Add boundary pages at the end
    for (let i = totalPages - boundaryCount + 1; i <= totalPages; i++) {
      if (i > rightSiblingIndex) {
        pages.push(i);
      }
    }

    return pages;
  }

  const pageNumbers = useMemo(
    () => pages(),
    [currentPage, totalPages, siblingCount, boundaryCount, maxVisiblePages]
  );

  return (
    <div
      className="flex flex-col-reverse md:flex-row md:justify-end items-center gap-3 py-3 px-2"
      {...props}
    >
      <div className="flex-1 whitespace-nowrap text-muted-foreground text-sm">
        {t(TRANSLATION_KEYS.common.table.selection.count, {
          selected: table.getFilteredSelectedRowModel().rows.length,
          total: table.getFilteredRowModel().rows.length,
        })}
      </div>
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
          <SelectTrigger className="h-8 w-18 data-size:h-8">
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
        {t(TRANSLATION_KEYS.common.table.pagination.pageOf, {
          current: table.getState().pagination.pageIndex + 1,
          total: table.getPageCount(),
        })}
      </div>
      <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 shadow-sm">
        {/* First */}
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="flex h-8 w-8 items-center justify-center rounded-md text-sm text-gray-500 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent transition"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Prev */}
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="flex h-8 w-8 items-center justify-center rounded-md text-sm text-gray-500 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Pages */}
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-sm text-gray-400"
              >
                …
              </span>
            );
          }
          const pageNum = page as number;
          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => table.setPageIndex(pageNum - 1)}
              className={`flex h-8 min-w-8 items-center justify-center rounded-md text-sm font-medium transition
                ${
                  pageNum === currentPage
                    ? "bg-brand-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }
                focus:outline-none focus:ring-1 focus:ring-gray-300`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="flex h-8 w-8 items-center justify-center rounded-md text-sm text-gray-500 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent transition"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last */}
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className="flex h-8 w-8 items-center justify-center rounded-md text-sm text-gray-500 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent transition"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
