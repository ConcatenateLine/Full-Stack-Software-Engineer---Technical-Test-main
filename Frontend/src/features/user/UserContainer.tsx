import DataTable from "@/common/components/DataTable";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "./services/UserService";
import UserColumns, { schema } from "./components/UserColumns";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Row } from "@tanstack/react-table";
import { z } from "zod";
import { useState } from "react";
import { Filters } from "@/common/types/TableTypes";

const UserContainer = () => {
  const navigate = useNavigate();
  const [deleteUser, { error }] = useDeleteUserMutation();
  const [isLoading, setIsLoading] = useState(false);
  const columns = UserColumns({
    edit: (row) => navigate(`user/${row.original.id}/edit`),
    delete: (row) => handleDelete(row),
  });
  const [tablePagination, setTablePagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [customFilters, setCustomFilters] = useState<Filters>({});

  const { refetch, isFetching } = useGetAllUsersQuery({
    page: tablePagination.pageIndex,
    limit: tablePagination.pageSize,
    filters: customFilters,
  });
  const { data, pagination, filters } = useSelector(
    (state: RootState) => state.user
  );

  const handleDelete = async (row: Row<z.infer<typeof schema>>) => {
    const id = row.original.id;
    try {
      await deleteUser(id);
      toast.success(`User ${row.original.firstName} deleted successfully`);
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleFilterChange = async (filters: Filters) => {
    console.log("filters", filters);
    
    setIsLoading(true);
    try {
      setCustomFilters((prev) => filters);
      await refetch();
    } catch (err) {
      toast.error("Failed to update filters");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaginationChange = async (limit: number, page: number) => {
    setIsLoading(true);
    try {
      setTablePagination((prev) => ({
        ...prev,
        pageSize: limit,
        pageIndex: page,
      }));

      await refetch();
    } catch (err) {
      toast.error("Failed to update pagination");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-9">
      <DataTable
        columns={columns}
        data={data}
        paginationCustom={pagination}
        filters={customFilters}
        isLoading={isLoading || isFetching}
        schema={schema}
        operations={{
          add: () => navigate("/dashboard/user/add"),
          handlePaginate: handlePaginationChange,
          setCustomFilters: handleFilterChange,
        }}
      />
    </div>
  );
};

export default UserContainer;
