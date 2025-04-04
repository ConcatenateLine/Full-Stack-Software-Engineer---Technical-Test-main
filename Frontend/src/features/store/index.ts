import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../user/slices/UserSlices";
import { authApi } from "../auth/services/AuthService";
import authReducer from "../auth/slices/AuthSlice";
import authCheckMiddleware from "../auth/services/AuthCheckService";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authCheckMiddleware.middleware,
      authApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
