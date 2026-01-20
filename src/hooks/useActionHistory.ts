import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ActionRecord, ActionHistoryFilters, PaginatedActionResponse, DeviceType, ActionType, ActionStatus } from "@/types/action";

// Generate mock action history data
const generateMockData = (): ActionRecord[] => {
  const deviceTypes: DeviceType[] = ["light", "fan", "ac"];
  const actions: ActionType[] = ["on", "off"];
  const statuses: ActionStatus[] = ["waiting", "success", "success", "success", "failed"]; // More success cases
  const records: ActionRecord[] = [];
  
  const now = new Date();
  for (let i = 0; i < 300; i++) {
    const timestamp = new Date(now.getTime() - i * 60000 * 5); // 5 minutes apart
    const status = i < 3 ? "waiting" : statuses[Math.floor(Math.random() * statuses.length)];
    
    records.push({
      id: `ACT-${String(1000 - i).padStart(4, "0")}`,
      deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      status,
      timestamp: timestamp.toISOString(),
    });
  }
  
  return records;
};

let mockData = generateMockData();

// Simulate server-side filtering and pagination
const fetchActionHistory = async (
  filters: ActionHistoryFilters
): Promise<PaginatedActionResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...mockData];

  // Filter by search
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter((record) => 
      record.id.toLowerCase().includes(searchLower) ||
      record.deviceType.toLowerCase().includes(searchLower) ||
      record.action.toLowerCase().includes(searchLower) ||
      record.status.toLowerCase().includes(searchLower)
    );
  }

  // Filter by device type
  if (filters.deviceType !== "all") {
    filtered = filtered.filter((record) => record.deviceType === filters.deviceType);
  }

  // Filter by status
  if (filters.status !== "all") {
    filtered = filtered.filter((record) => record.status === filters.status);
  }

  // Filter by date range
  if (filters.fromDate) {
    const fromTime = new Date(filters.fromDate).getTime();
    filtered = filtered.filter((record) => new Date(record.timestamp).getTime() >= fromTime);
  }
  if (filters.toDate) {
    const toTime = new Date(filters.toDate).getTime();
    filtered = filtered.filter((record) => new Date(record.timestamp).getTime() <= toTime);
  }

  // Sort by timestamp
  filtered.sort((a, b) => {
    const comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    return filters.sortOrder === "asc" ? comparison : -comparison;
  });

  // Paginate
  const total = filtered.length;
  const totalPages = Math.ceil(total / filters.pageSize);
  const startIndex = (filters.page - 1) * filters.pageSize;
  const data = filtered.slice(startIndex, startIndex + filters.pageSize);

  return {
    data,
    total,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages,
  };
};

const defaultFilters: ActionHistoryFilters = {
  deviceType: "all",
  status: "all",
  search: "",
  fromDate: "",
  toDate: "",
  sortOrder: "desc",
  page: 1,
  pageSize: 10,
};

// Function to add new action (for real-time updates)
export const addNewAction = (action: Omit<ActionRecord, "id" | "timestamp">) => {
  const newRecord: ActionRecord = {
    ...action,
    id: `ACT-${String(Date.now()).slice(-4)}`,
    timestamp: new Date().toISOString(),
  };
  mockData = [newRecord, ...mockData];
  return newRecord;
};

export const useActionHistory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<ActionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });

  // Parse filters from URL
  const filters: ActionHistoryFilters = useMemo(() => ({
    deviceType: (searchParams.get("deviceType") as DeviceType | "all") || defaultFilters.deviceType,
    status: (searchParams.get("status") as ActionStatus | "all") || defaultFilters.status,
    search: searchParams.get("search") || defaultFilters.search,
    fromDate: searchParams.get("fromDate") || defaultFilters.fromDate,
    toDate: searchParams.get("toDate") || defaultFilters.toDate,
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || defaultFilters.sortOrder,
    page: parseInt(searchParams.get("page") || "1"),
    pageSize: parseInt(searchParams.get("pageSize") || "10"),
  }), [searchParams]);

  // Update URL with new filters
  const updateFilters = useCallback((newFilters: Partial<ActionHistoryFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    
    // Reset to page 1 when filters change (except page/pageSize changes)
    if (!("page" in newFilters) && !("pageSize" in newFilters)) {
      updatedFilters.page = 1;
    }

    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== defaultFilters[key as keyof ActionHistoryFilters] && value !== "") {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Fetch data when filters change
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchActionHistory(filters);
        setData(response.data);
        setPagination({
          total: response.total,
          page: response.page,
          pageSize: response.pageSize,
          totalPages: response.totalPages,
        });
      } catch (error) {
        console.error("Failed to fetch action history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters]);

  // Refresh function for manual refresh
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchActionHistory(filters);
      setData(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error("Failed to refresh action history:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  return {
    data,
    isLoading,
    pagination,
    filters,
    updateFilters,
    refresh,
  };
};
