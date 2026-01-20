import { useState, useMemo } from "react";
import { Navigation } from "@/components/shared/Navigation";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { DeviceCard } from "@/components/dashboard/DeviceCard";
import { RealtimeChart } from "@/components/dashboard/RealtimeChart";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { useSensorData } from "@/hooks/useSensorData";
import { useDeviceControl } from "@/hooks/useDeviceControl";

const Index = () => {
  const [isConnected] = useState(true);
  const { sensorData, chartData } = useSensorData();
  const { deviceStates, toggleDevice } = useDeviceControl();

  // Mock notifications
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "success" as const,
      title: "Điều hòa bật OK",
      subtitle: "ACK received",
      device: "device",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "2",
      type: "pending" as const,
      title: "Gửi lệnh bật Điều hòa",
      subtitle: "Đang chờ...",
      device: "device",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "3",
      type: "success" as const,
      title: "Quạt bật OK",
      subtitle: "ACK received",
      device: "device",
      timestamp: new Date(Date.now() - 90000),
    },
  ]);

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isConnected={isConnected} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Sensor Cards Section */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Cảm biến
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SensorCard
              type="temperature"
              value={sensorData.temperature}
              unit="°C"
              lastUpdated={sensorData.lastUpdated}
            />
            <SensorCard
              type="humidity"
              value={sensorData.humidity}
              unit="%"
              lastUpdated={sensorData.lastUpdated}
            />
            <SensorCard
              type="light"
              value={sensorData.light}
              unit="lux"
              lastUpdated={sensorData.lastUpdated}
            />
          </div>
        </section>

        {/* Chart + Notifications Section */}
        <section className="grid grid-cols-1 xl:grid-cols-[70%_30%] gap-4">
          <RealtimeChart data={chartData} />
          <NotificationPanel 
            notifications={notifications} 
            onClear={handleClearNotifications} 
          />
        </section>

        {/* Device Control Section */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Điều khiển
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DeviceCard
              type="light"
              state={deviceStates.light}
              onToggle={() => toggleDevice("light")}
            />
            <DeviceCard
              type="fan"
              state={deviceStates.fan}
              onToggle={() => toggleDevice("fan")}
            />
            <DeviceCard
              type="ac"
              state={deviceStates.ac}
              onToggle={() => toggleDevice("ac")}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
