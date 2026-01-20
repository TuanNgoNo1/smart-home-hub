import { ActionRecord, DeviceType, ActionType, ActionStatus } from "@/types/action";
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
import { Power, Lightbulb, Fan, Snowflake } from "lucide-react";

interface ActionDataTableProps {
  data: ActionRecord[];
  isLoading: boolean;
}

const deviceConfig: Record<DeviceType, { label: string; icon: React.ReactNode }> = {
  light: { 
    label: "Đèn", 
    icon: <Lightbulb className="w-5 h-5 text-amber-500" /> 
  },
  fan: { 
    label: "Quạt", 
    icon: <Fan className="w-5 h-5 text-blue-500" /> 
  },
  ac: { 
    label: "Điều hòa", 
    icon: <Snowflake className="w-5 h-5 text-cyan-500" /> 
  },
};

const actionConfig: Record<ActionType, { label: string; colorClass: string }> = {
  on: { label: "BẬT", colorClass: "text-emerald-600" },
  off: { label: "TẮT", colorClass: "text-muted-foreground" },
};

const statusConfig: Record<ActionStatus, { label: string; badgeClass: string }> = {
  waiting: {
    label: "Đang xử lý",
    badgeClass: "bg-amber-50 text-amber-600 border-amber-300",
  },
  success: {
    label: "Thành công",
    badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-300",
  },
  failed: {
    label: "Lỗi/Timeout",
    badgeClass: "bg-red-50 text-red-600 border-red-300",
  },
};

export const ActionDataTable = ({ data, isLoading }: ActionDataTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[140px]">ID</TableHead>
              <TableHead className="w-[140px]">Thiết bị</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
              <TableHead className="w-[130px]">Status</TableHead>
              <TableHead>Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-36" /></TableCell>
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
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-[140px] font-medium text-muted-foreground">ID</TableHead>
            <TableHead className="w-[140px] font-medium text-muted-foreground">Thiết bị</TableHead>
            <TableHead className="w-[100px] font-medium text-muted-foreground">Action</TableHead>
            <TableHead className="w-[130px] font-medium text-muted-foreground">Status</TableHead>
            <TableHead className="font-medium text-muted-foreground">Thời gian</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => {
            const device = deviceConfig[record.deviceType];
            const action = actionConfig[record.action];
            const status = statusConfig[record.status];
            
            return (
              <TableRow key={record.id} className="hover:bg-muted/30 transition-colors border-b border-border/50">
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {record.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                      {device.icon}
                    </div>
                    <span className="font-medium">{device.label}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn("flex items-center gap-1.5 font-semibold", action.colorClass)}>
                    <Power className="w-4 h-4" />
                    <span>{action.label}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("font-medium text-xs rounded-full px-3 py-1", status.badgeClass)}
                  >
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
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
