import { Search, Filter, ArrowUpDown, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { SensorDataFilters, SensorType } from "@/types/sensor";
import { useState } from "react";

interface SensorFilterBarProps {
  filters: SensorDataFilters;
  onFilterChange: (filters: Partial<SensorDataFilters>) => void;
}

const sensorTypeOptions: {
  value: SensorType | "all";
  label: string;
}[] = [
  { value: "all", label: "Tất cả" },
  { value: "temperature", label: "Nhiệt độ" },
  { value: "humidity", label: "Độ ẩm" },
  { value: "light", label: "Ánh sáng" },
];

const sortOptions = [
  { value: "timestamp-desc", label: "Mới nhất" },
  { value: "timestamp-asc", label: "Cũ nhất" },
  { value: "value-desc", label: "Giá trị cao → thấp" },
  { value: "value-asc", label: "Giá trị thấp → cao" },
];

const quickTimeFilters = [
  { label: "5 phút", value: "5m" },
  { label: "1 giờ", value: "1h" },
  { label: "24 giờ", value: "24h" },
];

export const SensorFilterBar = ({ filters, onFilterChange }: SensorFilterBarProps) => {
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
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    setActiveQuickFilter(null);
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
    setActiveQuickFilter(null);
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

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as ["timestamp" | "value", "asc" | "desc"];
    onFilterChange({ sortBy, sortOrder });
  };

  const handleQuickFilter = (value: string) => {
    setActiveQuickFilter(value);
    const now = new Date();
    let fromDate: Date;

    switch (value) {
      case "5m":
        fromDate = new Date(now.getTime() - 5 * 60 * 1000);
        break;
      case "1h":
        fromDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "24h":
        fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      default:
        return;
    }

    setFromDate(fromDate);
    setToDate(now);
    setFromTime(format(fromDate, "HH:mm:ss"));
    setToTime(format(now, "HH:mm:ss"));
    onFilterChange({
      fromDate: fromDate.toISOString(),
      toDate: now.toISOString(),
    });
  };

  const currentSort = `${filters.sortBy}-${filters.sortOrder}`;

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-4">
      {/* Row 1: Search + Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm ID hoặc giá trị..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Sensor Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select
            value={filters.sensorType}
            onValueChange={(value) => onFilterChange({ sensorType: value as SensorType | "all" })}
          >
            <SelectTrigger className="w-[120px] bg-background">
              <SelectValue placeholder="Loại" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg z-50">
              {sensorTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px] bg-background">
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

      {/* Row 2: Quick Filters + Date/Time Range */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Quick Time Filters */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          {quickTimeFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeQuickFilter === filter.value ? "default" : "outline"}
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => handleQuickFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

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
