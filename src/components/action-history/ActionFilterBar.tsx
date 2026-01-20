import { Search, Filter, ArrowUpDown, Lightbulb, Fan, Snowflake } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ActionHistoryFilters, DeviceType, ActionStatus } from "@/types/action";
import { useState } from "react";

interface ActionFilterBarProps {
  filters: ActionHistoryFilters;
  onFilterChange: (filters: Partial<ActionHistoryFilters>) => void;
}

const deviceTypeOptions: {
  value: DeviceType | "all";
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "all", label: "Tất cả", icon: <Filter className="w-4 h-4" /> },
  { value: "light", label: "Đèn", icon: <Lightbulb className="w-4 h-4 text-amber-500" /> },
  { value: "fan", label: "Quạt", icon: <Fan className="w-4 h-4 text-blue-500" /> },
  { value: "ac", label: "Điều hòa", icon: <Snowflake className="w-4 h-4 text-cyan-500" /> },
];

const statusOptions: {
  value: ActionStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "Tất cả" },
  { value: "success", label: "Thành công" },
  { value: "waiting", label: "Đang xử lý" },
  { value: "failed", label: "Lỗi" },
];

const sortOptions = [
  { value: "desc", label: "Mới nhất" },
  { value: "asc", label: "Cũ nhất" },
];

export const ActionFilterBar = ({ filters, onFilterChange }: ActionFilterBarProps) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    filters.fromDate ? new Date(filters.fromDate) : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    filters.toDate ? new Date(filters.toDate) : undefined
  );
  const [fromTime, setFromTime] = useState(
    filters.fromDate ? format(new Date(filters.fromDate), "HH:mm:ss") : "00:00:00"
  );
  const [toTime, setToTime] = useState(
    filters.toDate ? format(new Date(filters.toDate), "HH:mm:ss") : "23:59:59"
  );

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    if (date) {
      const [hours, minutes, seconds] = fromTime.split(":").map(Number);
      date.setHours(hours, minutes, seconds);
      onFilterChange({ fromDate: date.toISOString() });
    } else {
      onFilterChange({ fromDate: "" });
    }
  };

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);
    if (date) {
      const [hours, minutes, seconds] = toTime.split(":").map(Number);
      date.setHours(hours, minutes, seconds);
      onFilterChange({ toDate: date.toISOString() });
    } else {
      onFilterChange({ toDate: "" });
    }
  };

  const handleFromTimeChange = (time: string) => {
    setFromTime(time);
    if (fromDate) {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const newDate = new Date(fromDate);
      newDate.setHours(hours, minutes, seconds);
      onFilterChange({ fromDate: newDate.toISOString() });
    }
  };

  const handleToTimeChange = (time: string) => {
    setToTime(time);
    if (toDate) {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const newDate = new Date(toDate);
      newDate.setHours(hours, minutes, seconds);
      onFilterChange({ toDate: newDate.toISOString() });
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-4">
      {/* Row 1: Search + Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm ID / Thiết bị / Action / Status..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Device Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select
            value={filters.deviceType}
            onValueChange={(value) => onFilterChange({ deviceType: value as DeviceType | "all" })}
          >
            <SelectTrigger className="w-[130px] bg-background">
              <SelectValue placeholder="Thiết bị" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg z-50">
              {deviceTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    {option.icon}
                    <span>{option.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={(value) => onFilterChange({ status: value as ActionStatus | "all" })}
        >
          <SelectTrigger className="w-[130px] bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border shadow-lg z-50">
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <Select
            value={filters.sortOrder}
            onValueChange={(value) => onFilterChange({ sortOrder: value as "asc" | "desc" })}
          >
            <SelectTrigger className="w-[120px] bg-background">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg z-50">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2: Date/Time Range */}
      <div className="flex flex-wrap items-center gap-4">
        {/* From DateTime - Combined Input */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Từ</span>
          <div className="flex items-center border border-input rounded-md bg-background overflow-hidden">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "h-9 px-3 text-sm border-r border-input hover:bg-muted transition-colors",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  {fromDate ? format(fromDate, "dd/MM/yyyy") : "dd/mm/yyyy"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border border-border shadow-lg z-50" align="start">
                <CalendarComponent
                  mode="single"
                  selected={fromDate}
                  onSelect={handleFromDateChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <input
              type="text"
              value={fromTime}
              onChange={(e) => handleFromTimeChange(e.target.value)}
              placeholder="00:00:00"
              className="h-9 w-[80px] px-2 text-sm bg-transparent focus:outline-none text-center"
            />
          </div>
        </div>

        {/* To DateTime - Combined Input */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Đến</span>
          <div className="flex items-center border border-input rounded-md bg-background overflow-hidden">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "h-9 px-3 text-sm border-r border-input hover:bg-muted transition-colors",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  {toDate ? format(toDate, "dd/MM/yyyy") : "dd/mm/yyyy"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border border-border shadow-lg z-50" align="start">
                <CalendarComponent
                  mode="single"
                  selected={toDate}
                  onSelect={handleToDateChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <input
              type="text"
              value={toTime}
              onChange={(e) => handleToTimeChange(e.target.value)}
              placeholder="23:59:59"
              className="h-9 w-[80px] px-2 text-sm bg-transparent focus:outline-none text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
