import { ROW_PER_PAGE } from "@/types/Params";
import { DataTableProps } from "./data-table";
import { CursorPageInfo } from "./data-table-pagination";
import { cn } from "../../lib/utils";
import { TRANSLATION_KEYS } from "@/config/translationKey";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataCursorPaginationProps<TData> extends DataTableProps<TData> {
  pageSizeOptions: number[];
  cursorPageInfo: CursorPageInfo;
  onCursorPageChange: (
    cursor: string | null,
    direction: "next" | "previous"
  ) => void;
}

export function DataCursorPagination<TData>({
  table,
  pageSizeOptions = ROW_PER_PAGE,
  className,
  cursorPageInfo,
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
