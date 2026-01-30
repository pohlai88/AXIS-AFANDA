'use client';

import { useIsMobile } from '@/app/hooks/use-media-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Column<T> {
  key: string;
  header: string;
  cell: (item: T) => React.ReactNode;
  mobileLabel?: string; // Label to show on mobile
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
}

/**
 * Responsive table that converts to cards on mobile
 * Usage: <ResponsiveTable data={items} columns={columns} keyExtractor={(item) => item.id} />
 */
export function ResponsiveTable<T>({ data, columns, keyExtractor }: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    // Mobile: Show as cards
    return (
      <div className="space-y-3">
        {data.map((item) => (
          <Card key={keyExtractor(item)}>
            <CardContent className="p-4 space-y-2">
              {columns.map((column) => (
                <div key={column.key} className="flex justify-between items-start gap-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    {column.mobileLabel || column.header}:
                  </span>
                  <div className="text-sm text-right">
                    {column.cell(item)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop: Show as table
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={keyExtractor(item)}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.cell(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
