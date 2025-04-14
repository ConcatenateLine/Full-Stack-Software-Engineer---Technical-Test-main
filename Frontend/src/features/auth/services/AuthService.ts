import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAuth, clearAuth, Credentials } from "../slices/AuthSlice";

export const AuthApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    validateToken: builder.query({
      query: () => ({
        url: "/validate-token",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(setAuth({ token: data.token, user: data.user }));
          }
        } catch (err) {
          dispatch(clearAuth());
        }
      },
    }),
    login: builder.mutation({
      query: (credentials: Credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth({ token: data.token, user: data.user }));
        } catch (err) {
          console.error("Login failed:", err);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearAuth());
        } catch (err) {
          console.error("Logout failed:", err);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = AuthApi;
