import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../types/UserType";
import { Pagination } from "@/common/types/TableTypes";

export type UsersResponse = {
  data: User[];
  pagination: Pagination;
};

export type UsersQuery = {
  filters: Record<string, string>;
  pageSize: number;
  pageParam: number;
};

export const UserApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["Users"],
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
    deleteUser: builder.mutation({
      invalidatesTags: ["Users"],
      query: (id: number) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),
    addUser: builder.mutation({
      invalidatesTags: ["Users"],
      query: (user: User) => ({
        url: "/users",
        method: "POST",
        body: { ...user, profilePicture: "develop" },
      }),
    }),
    updateUser: builder.mutation({
      invalidatesTags: ["Users"],
      query: (user: Partial<User>) => ({
        url: `/users/${user.id}`,
        method: "PUT",
        body: { ...user, profilePicture: "develop" },
      }),
    }),
    getUsersPaginated: builder.infiniteQuery<
      UsersResponse,
      {
        filters: Record<string, string>;
        pageSize: number;
        pageParam: number;
      },
      UsersQuery
    >({
      providesTags: ["Users"],
      infiniteQueryOptions: {
        initialPageParam: {
          filters: {},
          pageSize: 10,
          pageParam: 1,
        },
        getNextPageParam: (lastPage, _, lastPageParam) => {
          if (lastPage.pagination.hasMore) {
            return {
              filters: lastPageParam.filters,
              pageSize: lastPageParam.pageSize,
              pageParam: lastPageParam.pageParam + 1,
            };
          }
          return undefined;
        },
        getPreviousPageParam: (_, __, firstPageParam) => {
          if (firstPageParam.pageParam > 2) {
            return {
              filters: firstPageParam.filters,
              pageSize: firstPageParam.pageSize,
              pageParam: firstPageParam.pageParam - 1,
            };
          }
          return undefined;
        },
      },
      query: ({ queryArg, pageParam }) => {
        const { filters, pageSize } = queryArg;
        const params = {
          page: pageParam.pageParam.toString(),
          limit: pageSize.toString(),
          ...filters,
        };

        if (pageParam.pageSize != pageSize) {
          params["page"] = "1";
        }
        if (queryArg.pageParam != pageParam.pageParam) {
          params["page"] = queryArg.pageParam.toString();
        }
        return {
          url: `/users`,
          params,
        };
      },
    }),
  }),
});

export const {
  useDeleteUserMutation,
  useAddUserMutation,
  useUpdateUserMutation,
  useGetUsersPaginatedInfiniteQuery,
} = UserApi;
