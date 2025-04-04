import {
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  PlusIcon,
  RollerCoasterIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Filters, Pagination } from "../types/TableTypes";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const DataTable = ({
  data,
  columns,
  schema,
  operations,
  paginationCustom,
  filters,
  isLoading,
}: {
  data: any;
  columns: any;
  schema: z.ZodType<any>;
  paginationCustom: Pagination;
  filters: Filters;
  isLoading: boolean;
  operations: {
    add: () => void;
    handlePaginate: (limit: number, page: number) => void;
    setCustomFilters: (filters: Filters) => void;
  };
}) => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleFiltersChange = (filter: string, value: string) => {
    const currentValues = Object.keys(filters);
    const newFilter: Filters = {};

    let newValues: string[] = [];
    if (
      (currentValues.includes(filter) &&
        filters[filter as keyof Filters] === value) ||
      value === "All"
    ) {
      currentValues.forEach((key) => {
        if (key !== filter) {
          newValues.push(key);
        }
      });
    } else {
      newFilter[filter as keyof Filters] = value;
    }
  
    newValues.forEach((key) => {
      newFilter[key as keyof Filters] = filters[key as keyof Filters];
    });
    operations?.setCustomFilters(newFilter);
  };

  const handleFiltersTabs = (filter: string, value: string) => {
    const currentValues = Object.keys(filters);
    const newFilter: Filters = {};

    let newValues: string[] = [];
    if (
      currentValues.includes(filter) &&
      filters[filter as keyof Filters] === value
    ) {
      return;
    } else if (value === "All") {
      newValues = currentValues.filter((v) => v !== filter);
    } else {
      newFilter[filter as keyof Filters] = value;
    }

    for (const key of newValues) {
      newFilter[key as keyof Filters] = filters[key as keyof Filters];
    }
    operations?.setCustomFilters(newFilter);
  };

  const DraggableRow = ({ row }: { row: Row<z.infer<typeof schema>> }) => {
    return (
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageSize: paginationCustom.limit,
        pageIndex: 0,
      },
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <Tabs
      defaultValue="outline"
      className="flex w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select
          onValueChange={(value) => handleFiltersChange("status", value)}
          defaultValue={filters.status}
        >
          <SelectTrigger className="md:hidden flex w-fit" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer" value="Active">
              Active
            </SelectItem>
            <SelectItem className="cursor-pointer" value="Inactive">
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>
        <Tabs className="hidden md:flex" defaultValue={filters.status}>
          <TabsList>
            <TabsTrigger
              value="All"
              className="cursor-pointer"
              onClick={() => handleFiltersTabs("status", "All")}
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="Active"
              className="cursor-pointer"
              onClick={() => handleFiltersTabs("status", "Active")}
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="Inactive"
              className="gap-1 cursor-pointer"
              onClick={() => handleFiltersTabs("status", "Inactive")}
            >
              Inactive
              {/* <Badge
              variant="secondary"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
            >
              3
            </Badge> */}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Input
          placeholder="Search"
          className="hidden md:flex w-lg"
          value={filters.search}
          onChange={(e) => handleFiltersChange("search", e.target.value)}
          id="search"
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <RollerCoasterIcon />
                <span className="inline">Role</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem
                key="User"
                className="capitalize"
                checked={filters.role === "User"}
                onCheckedChange={(_) => handleFiltersChange("role", "User")}
              >
                User
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                key="Admin"
                className="capitalize"
                checked={filters.role === "Admin"}
                onCheckedChange={(_) => handleFiltersChange("role", "Admin")}
              >
                Admin
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={() => operations && operations.add()}
          >
            <PlusIcon />
            <span className="hidden lg:inline">Add User</span>
          </Button>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          {isLoading ? (
            <Skeleton className="h-96" />
          ) : (
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  table
                    .getRowModel()
                    .rows.map((row) => <DraggableRow key={row.id} row={row} />)
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex"></div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${paginationCustom.limit}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                  operations?.handlePaginate(Number(value), 1);
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue placeholder={paginationCustom.limit} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {paginationCustom.page} of {paginationCustom.totalPages}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex cursor-pointer"
                onClick={() => {
                  operations?.handlePaginate(
                    table.getState().pagination.pageSize,
                    1
                  );
                }}
                disabled={paginationCustom.page < 2}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8 cursor-pointer"
                size="icon"
                onClick={() => {
                  operations?.handlePaginate(
                    table.getState().pagination.pageSize,
                    paginationCustom.page - 1
                  );
                }}
                disabled={paginationCustom.page < 2}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8 cursor-pointer"
                size="icon"
                onClick={() => {
                  operations?.handlePaginate(
                    table.getState().pagination.pageSize,
                    paginationCustom.page + 1
                  );
                }}
                disabled={paginationCustom.page >= paginationCustom.totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex cursor-pointer"
                size="icon"
                onClick={() => {
                  operations?.handlePaginate(
                    table.getState().pagination.pageSize,
                    paginationCustom.totalPages
                  );
                }}
                disabled={paginationCustom.page >= paginationCustom.totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  );
};

export default DataTable;
