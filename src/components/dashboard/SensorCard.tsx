import { Thermometer, Droplets, Sun, LucideIcon, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type SensorType = "temperature" | "humidity" | "light";

interface SensorCardProps {
  type: SensorType;
  value: number;
  unit: string;
  lastUpdated: Date;
  warning?: string;
}

const sensorConfig: Record<SensorType, {
  icon: LucideIcon;
  label: string;
  cardClass: string;
  iconBgClass: string;
  iconColorClass: string;
  valueColorClass: string;
  warningThreshold?: { high?: number; low?: number };
}> = {
  temperature: {
    icon: Thermometer,
    label: "Nhiệt độ",
    cardClass: "sensor-card-temperature",
    iconBgClass: "bg-orange-100",
    iconColorClass: "text-orange-500",
    valueColorClass: "text-sensor-temperature",
    warningThreshold: { high: 30 },
  },
  humidity: {
    icon: Droplets,
    label: "Độ ẩm",
    cardClass: "sensor-card-humidity",
    iconBgClass: "bg-blue-100",
    iconColorClass: "text-blue-500",
    valueColorClass: "text-sensor-humidity",
    warningThreshold: { high: 80, low: 30 },
  },
  light: {
    icon: Sun,
    label: "Ánh sáng",
    cardClass: "sensor-card-light",
    iconBgClass: "bg-amber-100",
    iconColorClass: "text-amber-500",
    valueColorClass: "text-sensor-light",
    warningThreshold: { high: 1500 },
  },
};

export const SensorCard = ({ type, value, unit, lastUpdated, warning }: SensorCardProps) => {
  const config = sensorConfig[type];
  const Icon = config.icon;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  // Check for auto warning based on threshold
  const getWarning = () => {
    if (warning) return warning;
    const threshold = config.warningThreshold;
    if (threshold?.high && value >= threshold.high) {
      if (type === "temperature") return "Nhiệt độ cao";
      if (type === "humidity") return "Độ ẩm cao";
      if (type === "light") return "Ánh sáng mạnh";
    }
    if (threshold?.low && value <= threshold.low) {
      if (type === "humidity") return "Độ ẩm thấp";
    }
    return null;
  };

  const warningText = getWarning();

  return (
    <div className={cn("sensor-card", config.cardClass)}>
      {/* Warning Badge */}
      {warningText && (
        <Badge 
          variant="outline" 
          className="absolute top-3 left-3 bg-red-50 text-red-600 border-red-200 text-[10px] px-1.5 py-0.5 font-medium gap-1"
        >
          <AlertTriangle className="w-3 h-3" />
          {warningText}
        </Badge>
      )}

      {/* Last Updated Badge */}
      <div className="absolute top-3 right-3">
        <span className="text-[11px] font-medium text-muted-foreground">
          {formatTime(lastUpdated)}
        </span>
      </div>

      {/* Icon */}
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4 mt-4",
        config.iconBgClass
      )}>
        <Icon className={cn("w-6 h-6", config.iconColorClass)} />
      </div>

      {/* Label */}
      <p className="text-sm font-medium text-muted-foreground mb-1">
        {config.label}
      </p>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className={cn(
          "text-4xl font-bold tracking-tight",
          config.valueColorClass
        )}>
          {value}
        </span>
        <span className={cn(
          "text-lg font-medium",
          config.valueColorClass,
          "opacity-70"
        )}>
          {unit}
        </span>
      </div>
    </div>
  );
};
