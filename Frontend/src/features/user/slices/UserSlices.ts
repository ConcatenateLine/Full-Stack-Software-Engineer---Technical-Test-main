import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/UserType";
import { Pagination, Filters } from "@/common/types/TableTypes";

interface UserState {
  data: User[];
  pagination: Pagination;
  filters: Filters;
}

const initialState: UserState = {
  data: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 0,
    hasMore: false,
  },
  filters: {
    search: "",
    role: "",
    status: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateData: (state, action: PayloadAction<UserState>) => {
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
      state.filters = action.payload.filters;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.data = state.data.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    },
    resetState: () => initialState,
    deleteUser: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter((user) => user.id !== action.payload);
    },
  },
  selectors: {
    selectAll: (state) => state.data,
    selectById: (state, id) => state.data.find((user) => user.id === id),
  },
});

export const { updateData, updateUser, resetState, deleteUser } =
  userSlice.actions;

export const { selectAll, selectById } = userSlice.selectors;
export default userSlice.reducer;
