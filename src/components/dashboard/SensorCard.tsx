import { Thermometer, Droplets, Sun, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SensorType = "temperature" | "humidity" | "light";

interface SensorCardProps {
  type: SensorType;
  value: number;
  unit: string;
  lastUpdated: Date;
}

const sensorConfig: Record<SensorType, {
  icon: LucideIcon;
  label: string;
  cardClass: string;
  iconColorClass: string;
}> = {
  temperature: {
    icon: Thermometer,
    label: "Nhiệt độ",
    cardClass: "sensor-card-temperature",
    iconColorClass: "text-sensor-temperature",
  },
  humidity: {
    icon: Droplets,
    label: "Độ ẩm",
    cardClass: "sensor-card-humidity",
    iconColorClass: "text-sensor-humidity",
  },
  light: {
    icon: Sun,
    label: "Ánh sáng",
    cardClass: "sensor-card-light",
    iconColorClass: "text-sensor-light",
  },
};

export const SensorCard = ({ type, value, unit, lastUpdated }: SensorCardProps) => {
  const config = sensorConfig[type];
  const Icon = config.icon;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className={cn("sensor-card", config.cardClass)}>
      {/* Last Updated Badge */}
      <div className="absolute top-3 right-3">
        <span className="text-[10px] font-medium text-muted-foreground/70 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-full">
          {formatTime(lastUpdated)}
        </span>
      </div>

      {/* Icon */}
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
        type === "temperature" && "bg-sensor-temperature/15",
        type === "humidity" && "bg-sensor-humidity/15",
        type === "light" && "bg-sensor-light/15",
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
          "text-4xl font-bold tracking-tight font-mono",
          config.iconColorClass
        )}>
          {value}
        </span>
        <span className={cn(
          "text-lg font-medium",
          config.iconColorClass,
          "opacity-70"
        )}>
          {unit}
        </span>
      </div>
    </div>
  );
};
