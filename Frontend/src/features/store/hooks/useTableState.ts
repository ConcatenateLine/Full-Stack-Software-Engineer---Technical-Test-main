import { useDispatch, useSelector } from "react-redux";
import {
  initTable,
  setTableFilters,
  setTablePage,
  setTablePageSize,
  TableKey,
} from "../slices/TableSlice";
import { RootState } from "..";
import { useEffect } from "react";

export const useTableState = (key: TableKey, defaultPageSize = 10) => {
  const dispatch = useDispatch();
  const tableState = useSelector((state: RootState) => state.tableState[key]);

  useEffect(() => {
    dispatch(initTable({ key, pageSize: defaultPageSize }));
  }, [dispatch, key, defaultPageSize]);

  return {
    currentPage: tableState?.currentPage ?? 1,
    pageSize: tableState?.pageSize ?? defaultPageSize,
    filters: tableState?.filters ?? {},
    setPage: (page: number) => dispatch(setTablePage({ key, page })),
    setPageSize: (pageSize: number) =>
      dispatch(setTablePageSize({ key, pageSize })),
    setFilters: (filters: Record<string, string>) =>
      dispatch(setTableFilters({ key, filters })),
  };
};
