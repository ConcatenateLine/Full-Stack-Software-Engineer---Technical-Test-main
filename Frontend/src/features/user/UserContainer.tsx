import {
  useDeleteUserMutation,
  useGetUsersPaginatedInfiniteQuery,
} from "./services/UserService";
import UserColumns, { schema } from "./components/UserColumns";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Row } from "@tanstack/react-table";
import { z } from "zod";
import { GenericPaginateTable } from "@/common/components/GenericPaginateTable";
import { useDispatch } from "react-redux";
import { setSelectedUser } from "./slices/UserSlices";
import { User } from "./types/UserType";

const UserContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteUser] = useDeleteUserMutation();
  const handleDelete = async (row: Row<z.infer<typeof schema>>) => {
    const id = row.original.id;
    try {
      await deleteUser(id);
      toast.success(`User ${row.original.firstName} deleted successfully`);
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };
  const columns = UserColumns({
    edit: (row: Row<z.infer<typeof schema>>) => {
      dispatch(setSelectedUser(row.original as Partial<User>));
      navigate(`user/${row.original.id}/edit`);
    },
    delete: (row) => handleDelete(row),
  });

  return (
    <div>
      <GenericPaginateTable
        id="user"
        schema={schema}
        query={useGetUsersPaginatedInfiniteQuery}
        columns={columns}
        operations={{
          add: () => navigate("/dashboard/user/add"),
        }}
      />
    </div>
  );
};

export default UserContainer;
