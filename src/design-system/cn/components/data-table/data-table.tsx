import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import type * as React from "react";

import {
  CursorPageInfo,
  DataTablePagination,
} from "@dscn/components/data-table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@dscn/components/ui/table";
import { getColumnPinningStyle } from "@dscn/lib/data-table";
import { cn } from "@dscn/lib/utils";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEYS } from "@/config/translationKey";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  hasPagination?: boolean;
  isCursorPaged?: boolean;
  loading: boolean;
  cursorPageInfo?: CursorPageInfo;
  onCursorPageChange?: (
    cursor: string | null,
    direction: "next" | "previous"
  ) => void;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  hasPagination = true,
  isCursorPaged = false,
  loading = false,
  cursorPageInfo,
  onCursorPageChange,
  ...props
}: DataTableProps<TData>) {
  const { t } = useTranslation();
  return (
    <div
      className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)}
      {...props}
    >
      {children}
      <div className="rounded-md border">
        <Table className="flex-1 overflow-y-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getColumnPinningStyle({ column: header.column }),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              // Show data (even while loading)
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getColumnPinningStyle({ column: cell.column }),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : loading ? (
              // Skeleton only for initial load
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {table.getAllColumns().map((col) => (
                    <TableCell key={col.id} className="py-3">
                      <div className="h-5 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  {t(TRANSLATION_KEYS.common.table.noContent)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        {hasPagination && (
          <DataTablePagination
            isCursorPaged={isCursorPaged}
            table={table}
            cursorPageInfo={cursorPageInfo}
            onCursorPageChange={onCursorPageChange}
          />
        )}
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
