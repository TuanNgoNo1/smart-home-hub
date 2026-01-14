import { Search, Calendar, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { SensorDataFilters, SensorType } from "@/types/sensor";
import { useState } from "react";

interface SensorFilterBarProps {
  filters: SensorDataFilters;
  onFilterChange: (filters: Partial<SensorDataFilters>) => void;
}

const sensorTypeOptions: { value: SensorType | "all"; label: string }[] = [
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

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as ["timestamp" | "value", "asc" | "desc"];
    onFilterChange({ sortBy, sortOrder });
  };

  const currentSort = `${filters.sortBy}-${filters.sortOrder}`;

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo ID hoặc giá trị..."
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
            <SelectTrigger className="w-[160px] bg-background">
              <SelectValue placeholder="Loại cảm biến" />
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
            <SelectTrigger className="w-[180px] bg-background">
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

      {/* Date/Time Range */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* From DateTime */}
        <div className="flex items-center gap-2 flex-1">
          <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">Từ:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal flex-1 min-w-[140px]",
                  !fromDate && "text-muted-foreground"
                )}
              >
                {fromDate ? format(fromDate, "yyyy-MM-dd") : "Chọn ngày"}
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
          <Input
            type="time"
            step="1"
            value={fromTime}
            onChange={(e) => handleFromTimeChange(e.target.value)}
            className="w-[120px]"
          />
        </div>

        {/* To DateTime */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Đến:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal flex-1 min-w-[140px]",
                  !toDate && "text-muted-foreground"
                )}
              >
                {toDate ? format(toDate, "yyyy-MM-dd") : "Chọn ngày"}
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
          <Input
            type="time"
            step="1"
            value={toTime}
            onChange={(e) => handleToTimeChange(e.target.value)}
            className="w-[120px]"
          />
        </div>
      </div>
    </div>
  );
};
