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
import { Power, Loader2, Check, X } from "lucide-react";

interface ActionDataTableProps {
  data: ActionRecord[];
  isLoading: boolean;
}

const deviceConfig: Record<DeviceType, { label: string; icon: string }> = {
  light: { label: "Đèn", icon: "💡" },
  fan: { label: "Quạt", icon: "🌀" },
  ac: { label: "Điều hòa", icon: "❄️" },
};

const actionConfig: Record<ActionType, { label: string; colorClass: string }> = {
  on: { label: "BẬT", colorClass: "text-emerald-600" },
  off: { label: "TẮT", colorClass: "text-muted-foreground" },
};

const statusConfig: Record<ActionStatus, { label: string; badgeClass: string; icon: React.ReactNode }> = {
  waiting: {
    label: "Đang xử lý",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-300",
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
  },
  success: {
    label: "Thành công",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-300",
    icon: <Check className="w-3 h-3" />,
  },
  failed: {
    label: "Lỗi/Timeout",
    badgeClass: "bg-red-100 text-red-700 border-red-300",
    icon: <X className="w-3 h-3" />,
  },
};

export const ActionDataTable = ({ data, isLoading }: ActionDataTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead className="w-[140px]">Thiết bị</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead>Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-6 w-28" /></TableCell>
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
            <TableHead className="w-[100px] font-semibold hidden sm:table-cell">ID</TableHead>
            <TableHead className="w-[140px] font-semibold">Thiết bị</TableHead>
            <TableHead className="w-[100px] font-semibold">Action</TableHead>
            <TableHead className="w-[150px] font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Thời gian</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => {
            const device = deviceConfig[record.deviceType];
            const action = actionConfig[record.action];
            const status = statusConfig[record.status];
            
            return (
              <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-xs text-muted-foreground hidden sm:table-cell">
                  {record.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{device.icon}</span>
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
                    className={cn("font-medium gap-1.5", status.badgeClass)}
                  >
                    {status.icon}
                    {status.label}
                  </Badge>
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
