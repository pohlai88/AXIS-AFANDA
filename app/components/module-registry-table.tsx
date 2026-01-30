"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Module } from "@/app/lib/module-registry";
import { EmptyState } from "@/app/components/common/empty-states";
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  MessageSquare,
  Video,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  MessageSquare,
  Video,
};

const columns: ColumnDef<Module>[] = [
  {
    accessorKey: "name",
    header: "Module",
    cell: ({ row }) => {
      const Icon = row.original.icon ? iconMap[row.original.icon] : null;
      return (
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="bg-lux-gold-soft flex h-8 w-8 items-center justify-center rounded-lg">
              <Icon className="h-4 w-4 text-lux-gold" />
            </div>
          )}
          <div>
            <div className="font-medium">{row.original.name}</div>
            {row.original.description && (
              <div className="text-sm text-muted-foreground">
                {row.original.description}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground">
        {row.original.type === "in-app" ? "In-App" : "Iframe"}
      </Badge>
    ),
  },
  {
    accessorKey: "route",
    header: "Route",
    cell: ({ row }) => (
      <code className="text-xs text-muted-foreground">{row.original.route}</code>
    ),
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Switch
            id={`module-${row.original.id}`}
            checked={row.original.enabled}
            onCheckedChange={(checked) => {
              // TODO: Update module registry state
              console.log(`Toggle ${row.original.id}: ${checked}`);
            }}
          />
          <Label htmlFor={`module-${row.original.id}`} className="sr-only">
            Enable {row.original.name}
          </Label>
        </div>
      );
    },
  },
];

export function ModuleRegistryTable({ data }: { data: Module[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-8">
                <EmptyState
                  icon={LayoutDashboard}
                  title="No modules found"
                  description="No modules are available in the registry."
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
