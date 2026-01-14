import { SensorRecord, SensorType } from "@/types/sensor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SensorDataTableProps {
  data: SensorRecord[];
  isLoading: boolean;
  onSort?: (column: "timestamp" | "value") => void;
  sortBy?: "timestamp" | "value";
  sortOrder?: "asc" | "desc";
}

const sensorConfig: Record<
  SensorType,
  { label: string; unit: string; badgeClass: string }
> = {
  temperature: {
    label: "Nhiệt độ",
    unit: "°C",
    badgeClass: "bg-sensor-temperature/10 text-sensor-temperature border-sensor-temperature/30 hover:bg-sensor-temperature/20",
  },
  humidity: {
    label: "Độ ẩm",
    unit: "%",
    badgeClass: "bg-sensor-humidity/10 text-sensor-humidity border-sensor-humidity/30 hover:bg-sensor-humidity/20",
  },
  light: {
    label: "Ánh sáng",
    unit: "lux",
    badgeClass: "bg-sensor-light/10 text-sensor-light border-sensor-light/30 hover:bg-sensor-light/20",
  },
};

export const SensorDataTable = ({
  data,
  isLoading,
  onSort,
  sortBy,
  sortOrder,
}: SensorDataTableProps) => {
  const renderSortIndicator = (column: "timestamp" | "value") => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[120px]">ID</TableHead>
              <TableHead className="w-[150px]">Loại cảm biến</TableHead>
              <TableHead className="w-[120px]">Giá trị</TableHead>
              <TableHead>Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <p className="text-muted-foreground">Không có dữ liệu phù hợp với bộ lọc</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[120px] font-semibold">ID</TableHead>
            <TableHead className="w-[150px] font-semibold">Loại cảm biến</TableHead>
            <TableHead
              className={cn(
                "w-[120px] font-semibold",
                onSort && "cursor-pointer hover:text-foreground transition-colors"
              )}
              onClick={() => onSort?.("value")}
            >
              Giá trị{renderSortIndicator("value")}
            </TableHead>
            <TableHead
              className={cn(
                "font-semibold",
                onSort && "cursor-pointer hover:text-foreground transition-colors"
              )}
              onClick={() => onSort?.("timestamp")}
            >
              Thời gian{renderSortIndicator("timestamp")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => {
            const config = sensorConfig[record.sensorType];
            return (
              <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {record.id}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("font-medium", config.badgeClass)}
                  >
                    {config.label}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">
                  {record.value}
                  <span className="text-muted-foreground ml-1 font-normal">
                    {config.unit}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {format(new Date(record.timestamp), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
