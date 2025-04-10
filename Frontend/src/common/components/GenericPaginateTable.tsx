import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTableState } from "@/features/store/hooks/useTableState";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { Filters } from "../types/TableTypes";
import { z } from "zod";
import Debounce from "@/lib/Debounce";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  PlusIcon,
  RollerCoasterIcon,
  TagsIcon,
} from "lucide-react";
import { UsersResponse } from "@/features/user/services/UserService";
import { useCallback, useState } from "react";
import { CustomAlertDestructive } from "./CustomAlertDestructive";

interface GenericPaginateTableProps<T> {
  id: string;
  schema: z.ZodType<any>;
  query: Function;
  columns: ColumnDef<T>[];
  operations: {
    add: Function;
  };
}

export const GenericPaginateTable = <T,>({
  id,
  schema,
  query,
  columns,
  operations,
}: GenericPaginateTableProps<T>) => {
  const { currentPage, pageSize, filters, setPage, setPageSize, setFilters } =
    useTableState(id);
  const [search, setSearch] = useState(filters["search"] || "");

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    fetchPreviousPage,
    isError,
    error,
  } = query(
    {
      filters,
      pageSize,
      pageParam: currentPage,
    },
    { pageParam: currentPage }
  );

  const currentPageData = data?.pages.find(
    (page: UsersResponse) => page.pagination.page === currentPage
  );

  const rows = currentPageData?.data ?? [];
  const totalPages = currentPageData?.pagination.totalPages ?? 1;
  const waiting = isLoading || isFetching;
  const cleared = Object.keys(filters).length === 0;

  const table = useReactTable({
    data: rows,
    columns,
    pageCount: totalPages,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });

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

  const handleFiltersChange = (filter: string, value: string) => {
    const newFilter: Filters<string> = {
      ...filters,
    };

    if (
      value &&
      value !== "All" &&
      newFilter[filter as keyof Filters<string>] != value
    ) {
      newFilter[filter] = value;
    } else {
      delete newFilter[filter];
    }

    setFilters(newFilter);
  };

  const handleSearch = useCallback(
    Debounce((value: string) => {
      handleFiltersChange("search", value);
    }, 1000),
    []
  );

  const handleClear = () => {
    setFilters({});
    setSearch("");
  };

  return (
    <Tabs
      defaultValue="outline"
      className="flex w-full flex-col justify-start gap-6 py-6"
    >
      {isError && (
        <CustomAlertDestructive
          message={
            error instanceof Error
              ? error.message
              : typeof error?.error === "string"
              ? error?.error
              : typeof error?.data?.error === "string"
              ? error.data.error
              : "Something went wrong"
          }
        />
      )}
      <div className="flex items-center justify-between px-4 lg:px-6 gap-2">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select
          onValueChange={(value) => handleFiltersChange("status", value)}
          value={filters.status || "All"}
        >
          <SelectTrigger className="md:hidden flex w-fit" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer" value="All">
              All
            </SelectItem>
            <SelectItem className="cursor-pointer" value="Active">
              Active
            </SelectItem>
            <SelectItem className="cursor-pointer" value="Inactive">
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>
        <Tabs
          className="hidden md:flex"
          value={filters.status || "All"}
          onValueChange={(value) => handleFiltersChange("status", value)}
        >
          <TabsList>
            <TabsTrigger value="All" className="cursor-pointer">
              All
            </TabsTrigger>
            <TabsTrigger value="Active" className="cursor-pointer">
              Active
            </TabsTrigger>
            <TabsTrigger value="Inactive" className="gap-1 cursor-pointer">
              Inactive
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Input
          placeholder="Search"
          className="hidden md:flex w-lg"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearch(e.target.value);
          }}
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
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={handleClear}
            disabled={cleared}
          >
            <TagsIcon />
            <span className="hidden lg:inline">Clear</span>
          </Button>
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
          {operations?.add && (
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => operations.add()}
            >
              <PlusIcon />
              <span className="hidden lg:inline">Add User</span>
            </Button>
          )}
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          {waiting ? (
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
                value={`${pageSize}`}
                onValueChange={(value) => {
                  setPage(1);
                  setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue placeholder={pageSize} />
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
              Page {currentPage} of {totalPages}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex cursor-pointer"
                onClick={() => {
                  setPage(1);
                }}
                disabled={currentPage < 2}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8 cursor-pointer"
                size="icon"
                onClick={() => {
                  setPage(currentPage - 1);
                  fetchPreviousPage();
                }}
                disabled={currentPage < 2}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8 cursor-pointer"
                size="icon"
                onClick={() => {
                  setPage(currentPage + 1);
                  fetchNextPage();
                }}
                disabled={currentPage >= totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex cursor-pointer"
                size="icon"
                onClick={() => {
                  setPage(totalPages);
                }}
                disabled={currentPage >= totalPages}
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
