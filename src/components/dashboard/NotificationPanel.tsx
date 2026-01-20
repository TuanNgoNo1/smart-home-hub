import { Bell, Trash2, ChevronLeft, ChevronRight, Check, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Notification {
  id: string;
  type: "success" | "pending" | "error";
  title: string;
  subtitle: string;
  device?: string;
  timestamp: Date;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onClear: () => void;
}

const tabs = [
  { id: "all", label: "Tất cả" },
  { id: "device", label: "Thiết bị" },
  { id: "sensor", label: "Cảm biến" },
  { id: "system", label: "Hệ thống" },
];

export const NotificationPanel = ({ notifications, onClear }: NotificationPanelProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [showWarningsOnly, setShowWarningsOnly] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff} giây trước`;
    if (diff < 3600) return `dưới ${Math.ceil(diff / 60)} phút trước`;
    return `${Math.floor(diff / 3600)} giờ trước`;
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Check className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getIconBg = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-emerald-100 text-emerald-600";
      case "pending":
        return "bg-gray-100 text-gray-500";
      case "error":
        return "bg-red-100 text-red-600";
    }
  };

  const deviceCount = notifications.filter(n => n.device).length;

  return (
    <div className="bg-card rounded-2xl border border-border p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="font-semibold text-foreground">Thông báo</span>
          <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full font-medium">
            {notifications.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClear}>
          <Trash2 className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Tabs with scroll */}
      <div className="flex items-center gap-1 mb-3">
        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-1 overflow-x-auto flex-1 scrollbar-hide">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              className={cn(
                "text-xs px-3 h-7 whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.id === "all" && ` (${notifications.length})`}
              {tab.id === "device" && ` (${deviceCount})`}
            </Button>
          ))}
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Warning Filter */}
      <div className="flex items-center justify-between py-2 border-b border-border mb-3">
        <span className="text-xs text-muted-foreground">Chỉ Warning/Error</span>
        <Switch
          checked={showWarningsOnly}
          onCheckedChange={setShowWarningsOnly}
          className="scale-75"
        />
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              getIconBg(notification.type)
            )}>
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground truncate">
                  {notification.title}
                </span>
                {notification.device && (
                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
                    device
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {notification.subtitle}
              </p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                {formatTime(notification.timestamp)} • {getTimeAgo(notification.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
