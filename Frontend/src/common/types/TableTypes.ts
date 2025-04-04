export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

export type Filters = {
  search?: string;
  role?: string;
  status?: string;
};
