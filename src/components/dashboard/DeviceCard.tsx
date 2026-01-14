import { Lightbulb, Fan, Snowflake, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type DeviceType = "light" | "fan" | "ac";
type DeviceState = "off" | "loading" | "on" | "failed";

interface DeviceCardProps {
  type: DeviceType;
  state: DeviceState;
  onToggle: () => void;
}

const deviceConfig: Record<DeviceType, {
  label: string;
  labelVi: string;
}> = {
  light: {
    label: "Light",
    labelVi: "Đèn",
  },
  fan: {
    label: "Fan",
    labelVi: "Quạt",
  },
  ac: {
    label: "Air Conditioner",
    labelVi: "Điều hòa",
  },
};

export const DeviceCard = ({ type, state, onToggle }: DeviceCardProps) => {
  const config = deviceConfig[type];
  const isOn = state === "on";
  const isLoading = state === "loading";
  const isFailed = state === "failed";
  const isDisabled = isLoading;

  const renderIcon = () => {
    const baseClasses = "w-12 h-12 transition-all duration-300";
    
    if (isFailed) {
      return <AlertCircle className={cn(baseClasses, "text-device-failed")} />;
    }

    switch (type) {
      case "light":
        return (
          <Lightbulb 
            className={cn(
              baseClasses,
              isOn 
                ? "text-amber-400 fill-amber-400 animate-pulse-glow" 
                : "text-device-off"
            )} 
          />
        );
      case "fan":
        return (
          <Fan 
            className={cn(
              baseClasses,
              isOn 
                ? "text-sensor-humidity animate-spin-slow" 
                : "text-device-off"
            )} 
          />
        );
      case "ac":
        return (
          <Snowflake 
            className={cn(
              baseClasses,
              isOn 
                ? "text-cyan-500 animate-wave" 
                : "text-device-off"
            )} 
          />
        );
    }
  };

  const getStateLabel = () => {
    switch (state) {
      case "off": return "Tắt";
      case "loading": return "Đang xử lý...";
      case "on": return "Bật";
      case "failed": return "Lỗi kết nối";
    }
  };

  return (
    <div className={cn(
      "device-card flex flex-col items-center text-center",
      isOn && "ring-2 ring-device-on/30",
      isFailed && "ring-2 ring-device-failed/30"
    )}>
      {/* Status indicator */}
      <div className={cn(
        "absolute top-4 right-4 w-2.5 h-2.5 rounded-full transition-all duration-300",
        state === "off" && "bg-device-off",
        state === "loading" && "bg-device-loading animate-pulse",
        state === "on" && "bg-device-on shadow-[0_0_8px_hsl(150,70%,45%)]",
        state === "failed" && "bg-device-failed animate-pulse"
      )} />

      {/* Icon Container */}
      <div className={cn(
        "relative w-24 h-24 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
        isOn && type === "light" && "bg-amber-100/50 shadow-glow-light",
        isOn && type === "fan" && "bg-blue-100/50 shadow-glow-cool",
        isOn && type === "ac" && "bg-cyan-100/50 shadow-glow-cool",
        !isOn && !isFailed && "bg-muted",
        isFailed && "bg-red-100/50"
      )}>
        {isLoading ? (
          <Loader2 className="w-12 h-12 text-device-loading animate-spin" />
        ) : (
          renderIcon()
        )}
      </div>

      {/* Labels */}
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {config.labelVi}
      </h3>
      <p className={cn(
        "text-sm font-medium mb-4",
        state === "off" && "text-muted-foreground",
        state === "loading" && "text-device-loading",
        state === "on" && "text-device-on",
        state === "failed" && "text-device-failed"
      )}>
        {getStateLabel()}
      </p>

      {/* Toggle Button */}
      <Button
        onClick={onToggle}
        disabled={isDisabled}
        className={cn(
          "w-full transition-all duration-300",
          isOn && "bg-device-on hover:bg-device-on/90",
          !isOn && !isFailed && "bg-foreground hover:bg-foreground/90",
          isFailed && "bg-device-failed hover:bg-device-failed/90"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Đang xử lý
          </>
        ) : isFailed ? (
          "Thử lại"
        ) : isOn ? (
          "Tắt thiết bị"
        ) : (
          "Bật thiết bị"
        )}
      </Button>
    </div>
  );
};
