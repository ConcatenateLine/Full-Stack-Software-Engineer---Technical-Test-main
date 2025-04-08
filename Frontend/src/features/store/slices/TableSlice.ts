import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TableKey = string;

interface TableState {
  currentPage: number;
  pageSize: number;
  filters: Record<string, string>;
}

type TableStates = Record<TableKey, TableState>;

const initialState: TableStates = {};

const tableSlice = createSlice({
  name: "tableState",
  initialState,
  reducers: {
    initTable: (
      state,
      action: PayloadAction<{ key: TableKey; pageSize?: number }>
    ) => {
      const { key, pageSize = 10 } = action.payload;

      if (!state[key]) {
        state[key] = {
          currentPage: 1,
          pageSize: pageSize,
          filters: {},
        };
      }
    },
    setTablePage: (
      state,
      action: PayloadAction<{ key: TableKey; page: number }>
    ) => {
      if (state[action.payload.key]) {
        state[action.payload.key].currentPage = action.payload.page;
      }
    },
    setTableFilters: (
      state,
      action: PayloadAction<{ key: TableKey; filters: Record<string, string> }>
    ) => {
      const { key, filters } = action.payload;

      if (state[key]) {
        state[key].filters = filters;
        state[key].currentPage = 1;
      }
    },
    setTablePageSize: (
      state,
      action: PayloadAction<{ key: TableKey; pageSize: number }>
    ) => {
      if (state[action.payload.key]) {
        state[action.payload.key].pageSize = action.payload.pageSize;
      }
    },
  },
});

export const { initTable, setTablePage, setTableFilters, setTablePageSize } =
  tableSlice.actions;
export default tableSlice.reducer;
