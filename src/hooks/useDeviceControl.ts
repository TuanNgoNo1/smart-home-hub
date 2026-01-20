import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

type DeviceState = "off" | "loading" | "on" | "failed";

interface DeviceStates {
  light: DeviceState;
  fan: DeviceState;
  ac: DeviceState;
}

export interface DeviceNotification {
  id: string;
  type: "success" | "pending" | "error";
  title: string;
  subtitle: string;
  device: string;
  timestamp: Date;
}

const STORAGE_KEY = "iot_device_states";
const ACK_TIMEOUT = 10000; // 10 seconds

// Simulate ACK response from device
const simulateDeviceACK = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate network delay (1-3 seconds)
    const delay = 1000 + Math.random() * 2000;
    // 90% success rate for simulation
    const success = Math.random() > 0.1;
    
    setTimeout(() => {
      resolve(success);
    }, delay);
  });
};

export const useDeviceControl = () => {
  const [deviceStates, setDeviceStates] = useState<DeviceStates>(() => {
    // Load initial state from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Reset any loading/failed states to off on reload
        return {
          light: parsed.light === "on" ? "on" : "off",
          fan: parsed.fan === "on" ? "on" : "off",
          ac: parsed.ac === "on" ? "on" : "off",
        };
      } catch {
        return { light: "off", fan: "off", ac: "off" };
      }
    }
    return { light: "off", fan: "off", ac: "off" };
  });

  const [notifications, setNotifications] = useState<DeviceNotification[]>([]);

  // Save to localStorage whenever states change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deviceStates));
  }, [deviceStates]);

  const addNotification = useCallback((notification: Omit<DeviceNotification, "id" | "timestamp">) => {
    const newNotification: DeviceNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
  }, []);

  const updateNotification = useCallback((id: string, updates: Partial<DeviceNotification>) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, ...updates, timestamp: new Date() } : n)
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const toggleDevice = useCallback(async (device: keyof DeviceStates) => {
    const currentState = deviceStates[device];
    
    // Don't allow toggle if already loading
    if (currentState === "loading") return;

    const targetState = currentState === "on" ? "off" : "on";
    
    // Set to loading state
    setDeviceStates(prev => ({ ...prev, [device]: "loading" }));

    const deviceNames: Record<keyof DeviceStates, string> = {
      light: "Đèn",
      fan: "Quạt",
      ac: "Điều hòa",
    };

    // Add pending notification
    const pendingId = Date.now().toString();
    addNotification({
      type: "pending",
      title: `Gửi lệnh ${targetState === "on" ? "bật" : "tắt"} ${deviceNames[device]}`,
      subtitle: "Đang chờ phản hồi...",
      device: device,
    });

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => reject(new Error("Timeout")), ACK_TIMEOUT);
      });

      // Race between ACK and timeout
      const success = await Promise.race([
        simulateDeviceACK(),
        timeoutPromise,
      ]);

      if (success) {
        setDeviceStates(prev => ({ ...prev, [device]: targetState }));
        
        // Add success notification
        addNotification({
          type: "success",
          title: `${deviceNames[device]} ${targetState === "on" ? "bật" : "tắt"} OK`,
          subtitle: "ACK received",
          device: device,
        });

        toast({
          title: "Thành công",
          description: `${deviceNames[device]} đã ${targetState === "on" ? "bật" : "tắt"}`,
        });
      } else {
        throw new Error("ACK failed");
      }
    } catch (error) {
      setDeviceStates(prev => ({ ...prev, [device]: "failed" }));
      
      // Add error notification
      addNotification({
        type: "error",
        title: `Lỗi ${deviceNames[device]}`,
        subtitle: "Không nhận được tín hiệu",
        device: device,
      });

      toast({
        variant: "destructive",
        title: "Lỗi kết nối",
        description: `Không nhận được tín hiệu từ ${deviceNames[device]}. Vui lòng thử lại.`,
      });
    }
  }, [deviceStates, addNotification]);

  return {
    deviceStates,
    toggleDevice,
    notifications,
    clearNotifications,
  };
};
