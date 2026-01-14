import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SensorRecord, SensorDataFilters, PaginatedResponse, SensorType } from "@/types/sensor";

// Generate mock sensor data
const generateMockData = (): SensorRecord[] => {
  const sensorTypes: SensorType[] = ["temperature", "humidity", "light"];
  const records: SensorRecord[] = [];
  
  const now = new Date();
  for (let i = 0; i < 500; i++) {
    const sensorType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
    const timestamp = new Date(now.getTime() - i * 30000); // 30 seconds apart
    
    let value: number;
    switch (sensorType) {
      case "temperature":
        value = Math.round((20 + Math.random() * 20) * 10) / 10;
        break;
      case "humidity":
        value = Math.round((40 + Math.random() * 50) * 10) / 10;
        break;
      case "light":
        value = Math.round(100 + Math.random() * 2000);
        break;
    }
    
    records.push({
      id: `SEN-${String(1000 - i).padStart(4, "0")}`,
      sensorType,
      value,
      timestamp: timestamp.toISOString(),
    });
  }
  
  return records;
};

const mockData = generateMockData();

// Simulate server-side filtering and pagination
const fetchSensorData = async (
  filters: SensorDataFilters
): Promise<PaginatedResponse<SensorRecord>> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...mockData];

  // Filter by search
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (record) =>
        record.id.toLowerCase().includes(searchLower) ||
        String(record.value).includes(searchLower)
    );
  }

  // Filter by sensor type
  if (filters.sensorType !== "all") {
    filtered = filtered.filter((record) => record.sensorType === filters.sensorType);
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

  // Sort
  filtered.sort((a, b) => {
    let comparison = 0;
    if (filters.sortBy === "timestamp") {
      comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    } else if (filters.sortBy === "value") {
      comparison = a.value - b.value;
    }
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

const defaultFilters: SensorDataFilters = {
  search: "",
  sensorType: "all",
  fromDate: "",
  toDate: "",
  sortBy: "timestamp",
  sortOrder: "desc",
  page: 1,
  pageSize: 10,
};

export const useSensorHistory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<SensorRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });

  // Parse filters from URL
  const filters: SensorDataFilters = useMemo(() => ({
    search: searchParams.get("search") || defaultFilters.search,
    sensorType: (searchParams.get("sensorType") as SensorType | "all") || defaultFilters.sensorType,
    fromDate: searchParams.get("fromDate") || defaultFilters.fromDate,
    toDate: searchParams.get("toDate") || defaultFilters.toDate,
    sortBy: (searchParams.get("sortBy") as "timestamp" | "value") || defaultFilters.sortBy,
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || defaultFilters.sortOrder,
    page: parseInt(searchParams.get("page") || "1"),
    pageSize: parseInt(searchParams.get("pageSize") || "10"),
  }), [searchParams]);

  // Update URL with new filters
  const updateFilters = useCallback((newFilters: Partial<SensorDataFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    
    // Reset to page 1 when filters change (except page/pageSize changes)
    if (!("page" in newFilters) && !("pageSize" in newFilters)) {
      updatedFilters.page = 1;
    }

    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== defaultFilters[key as keyof SensorDataFilters] && value !== "") {
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
        const response = await fetchSensorData(filters);
        setData(response.data);
        setPagination({
          total: response.total,
          page: response.page,
          pageSize: response.pageSize,
          totalPages: response.totalPages,
        });
      } catch (error) {
        console.error("Failed to fetch sensor data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters]);

  return {
    data,
    isLoading,
    pagination,
    filters,
    updateFilters,
  };
};
