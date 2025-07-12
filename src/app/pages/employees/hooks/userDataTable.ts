import { useState, useEffect, useCallback } from 'react';
import type { PaginationState, OnChangeFn } from '@tanstack/react-table';
import type {
  PaginationResponse,
  TableFilters,
} from '@/app/shared/interfaces/table';
import { ErrorTexts } from '@/constants/localize';
import { fetchUsersWithPagination } from '../../../shared/data/mockUser';
import type { User } from '@/app/shared/interfaces/user';
import { useConfigStore } from '@/app/shared/stores/useConfigStore';

interface UseDataTableReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  pageCount: number;
  searchValue: string;
  filters: TableFilters;
  setData: (data: T[]) => void;
  setPagination: OnChangeFn<PaginationState>;
  setSearchValue: (search: string) => void;
  setFilters: (filters: TableFilters) => void;
  refetch: () => void;
}

export function useDataTable<T>({
  endpoint,
  initialPageSize = 10,
  initialFilters = {},
}: {
  endpoint: string;
  initialPageSize?: number;
  initialFilters?: TableFilters;
}): UseDataTableReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<TableFilters>(initialFilters);
  const [pagination, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const { companyId } = useConfigStore();

  const setPagination: OnChangeFn<PaginationState> = (updaterOrValue) => {
    setPaginationState((prev) => {
      const newValue =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(prev)
          : updaterOrValue;
      return newValue;
    });
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (endpoint.includes('/users')) {
        const result: PaginationResponse<User> = await fetchUsersWithPagination(
          pagination.pageIndex + 1,
          pagination.pageSize,
          searchValue || '',
          companyId || ''
        );
        setData(result.data as T[]);
        setPageCount(result.totalPages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : ErrorTexts.genericError);
      setData([]);
      setPageCount(0);
    } finally {
      setLoading(false);
    }
  }, [
    endpoint,
    pagination.pageIndex,
    pagination.pageSize,
    searchValue,
    companyId,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = useCallback((search: string) => {
    setSearchValue(search);
    setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleFiltersChange = useCallback((newFilters: TableFilters) => {
    setFilters(newFilters);
    setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    pageCount,
    searchValue,
    filters,
    setData,
    setPagination,
    setSearchValue: handleSearchChange,
    setFilters: handleFiltersChange,
    refetch: fetchData,
  };
}
