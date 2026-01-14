export type SensorType = "temperature" | "humidity" | "light";

export interface SensorRecord {
  id: string;
  sensorType: SensorType;
  value: number;
  timestamp: string;
}

export interface SensorDataFilters {
  search: string;
  sensorType: SensorType | "all";
  fromDate: string;
  toDate: string;
  sortBy: "timestamp" | "value";
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
