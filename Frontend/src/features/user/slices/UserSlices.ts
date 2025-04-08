import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/UserType";

interface UserState {
  selectedUser: Partial<User> | null;
}

const initialState: UserState = {
  selectedUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<Partial<User>>) => {
      state.selectedUser = action.payload;
    },
    resetState: () => initialState,
  },
});

export const { setSelectedUser, resetState } = userSlice.actions;
export default userSlice.reducer;
