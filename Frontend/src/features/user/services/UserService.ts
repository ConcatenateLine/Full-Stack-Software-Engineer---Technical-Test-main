import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { updateData, resetState, deleteUser } from "../slices/UserSlices";
import { User } from "../types/UserType";
import { DeepPartial } from "react-hook-form";
import { Filters } from "@/common/types/TableTypes";

export const UserApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8181/api",
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
    getAllUsers: builder.query({
      query: ({
        page,
        limit,
        filters,
      }: {
        page: number;
        limit: number;
        filters: Filters;
      }) => ({
        url: "/users",
        method: "GET",
        params:{
          page,
          limit,
          ...filters
        }
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data) {
            dispatch(updateData(data));
          }
        } catch (err) {
          dispatch(resetState());
        }
      },
    }),
    deleteUser: builder.mutation({
      query: (id: number) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id: number, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(deleteUser(id));
        } catch (err) {
          throw new Error("Failed to delete user");
        }
      },
    }),
    addUser: builder.mutation({
      query: (user: User) => ({
        url: "/users",
        method: "POST",
        body: { ...user, profilePicture: "develop" },
      }),
      async onQueryStarted(user: User, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data.errors) {
            throw new Error(data.errors);
          }
        } catch (err) {
          throw new Error("Failed to add user");
        }
      },
    }),
    updateUser: builder.mutation({
      query: (user: User) => ({
        url: `/users/${user.id}`,
        method: "PUT",
        body: { ...user, profilePicture: "develop" },
      }),
      async onQueryStarted(
        user: DeepPartial<User>,
        { dispatch, queryFulfilled }
      ) {
        try {
          const { data } = await queryFulfilled;

          if (data.errors) {
            throw new Error(data.errors);
          }
        } catch (err) {
          throw new Error("Failed to update user");
        }
      },
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useAddUserMutation,
  useUpdateUserMutation,
} = UserApi;
