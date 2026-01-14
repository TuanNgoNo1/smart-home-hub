import { Calendar, Filter, ArrowUpDown } from "lucide-react";
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
import { ActionHistoryFilters, DeviceType } from "@/types/action";
import { useState } from "react";

interface ActionFilterBarProps {
  filters: ActionHistoryFilters;
  onFilterChange: (filters: Partial<ActionHistoryFilters>) => void;
}

const deviceTypeOptions: { value: DeviceType | "all"; label: string; icon: string }[] = [
  { value: "all", label: "Tất cả thiết bị", icon: "📱" },
  { value: "light", label: "Đèn", icon: "💡" },
  { value: "fan", label: "Quạt", icon: "🌀" },
  { value: "ac", label: "Điều hòa", icon: "❄️" },
];

const sortOptions = [
  { value: "desc", label: "Mới nhất trước" },
  { value: "asc", label: "Cũ nhất trước" },
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
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Device Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select
            value={filters.deviceType}
            onValueChange={(value) => onFilterChange({ deviceType: value as DeviceType | "all" })}
          >
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Loại thiết bị" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg z-50">
              {deviceTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <Select
            value={filters.sortOrder}
            onValueChange={(value) => onFilterChange({ sortOrder: value as "asc" | "desc" })}
          >
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
          <input
            type="time"
            step="1"
            value={fromTime}
            onChange={(e) => handleFromTimeChange(e.target.value)}
            className="flex h-10 w-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
          <input
            type="time"
            step="1"
            value={toTime}
            onChange={(e) => handleToTimeChange(e.target.value)}
            className="flex h-10 w-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>
    </div>
  );
};
