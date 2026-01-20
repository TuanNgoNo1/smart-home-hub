import { Search, Calendar, Filter, ArrowUpDown, Lightbulb, Fan, Snowflake, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
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
      <div className="flex flex-wrap items-center gap-3">
        {/* From DateTime */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Từ:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 text-xs font-normal",
                  !fromDate && "text-muted-foreground"
                )}
              >
                {fromDate ? format(fromDate, "dd/MM/yyyy") : "Ngày"}
              </Button>
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
          <TimePicker value={fromTime} onChange={handleFromTimeChange} />
        </div>

        {/* To DateTime */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Đến:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 text-xs font-normal",
                  !toDate && "text-muted-foreground"
                )}
              >
                {toDate ? format(toDate, "dd/MM/yyyy") : "Ngày"}
              </Button>
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
          <TimePicker value={toTime} onChange={handleToTimeChange} />
        </div>
      </div>
    </div>
  );
};
