export type DeviceType = "light" | "fan" | "ac";
export type ActionType = "on" | "off";
export type ActionStatus = "waiting" | "success" | "failed";

export interface ActionRecord {
  id: string;
  deviceType: DeviceType;
  action: ActionType;
  status: ActionStatus;
  timestamp: string;
}

export interface ActionHistoryFilters {
  deviceType: DeviceType | "all";
  status: ActionStatus | "all";
  search: string;
  fromDate: string;
  toDate: string;
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface PaginatedActionResponse {
  data: ActionRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
