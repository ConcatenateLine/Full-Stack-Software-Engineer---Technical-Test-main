import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/UserType";

interface UserState {
  list: User[];
}

const initialState: UserState = {
  list: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateList: (state, action: PayloadAction<User[]>) => {
      state.list = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.list = state.list.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    },
  },
});

export const { updateList, updateUser } = userSlice.actions;
export default userSlice.reducer;
