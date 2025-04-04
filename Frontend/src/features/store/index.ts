import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../user/slices/UserSlices";
import authReducer from "../auth/slices/AuthSlice";
import authCheckMiddleware from "../auth/services/AuthCheckService";
import { AuthApi } from "../auth/services/AuthService";
import { UserApi } from "../user/services/UserService";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authCheckMiddleware.middleware,
      AuthApi.middleware,
      UserApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
