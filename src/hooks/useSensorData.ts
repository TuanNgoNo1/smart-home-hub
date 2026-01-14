import { useState, useEffect, useCallback, useRef } from "react";

interface SensorData {
  temperature: number;
  humidity: number;
  light: number;
  lastUpdated: Date;
}

interface ChartDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  light: number;
}

const MAX_DATA_POINTS = 20;

// Simulate sensor readings with realistic variations
const generateSensorValue = (base: number, range: number, prevValue?: number): number => {
  if (prevValue !== undefined) {
    // Add small random variation to previous value
    const delta = (Math.random() - 0.5) * range * 0.3;
    const newValue = prevValue + delta;
    // Keep within bounds
    return Math.max(base - range/2, Math.min(base + range/2, newValue));
  }
  return base + (Math.random() - 0.5) * range;
};

export const useSensorData = () => {
  const prevValues = useRef<{ temp: number; humidity: number; light: number }>({
    temp: 28,
    humidity: 80,
    light: 1000,
  });

  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 28,
    humidity: 80,
    light: 1000,
    lastUpdated: new Date(),
  });

  const [chartData, setChartData] = useState<ChartDataPoint[]>(() => {
    // Initialize with some historical data
    const initialData: ChartDataPoint[] = [];
    const now = new Date();
    
    for (let i = MAX_DATA_POINTS - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 2000);
      initialData.push({
        time: time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        temperature: Math.round(generateSensorValue(28, 10)),
        humidity: Math.round(generateSensorValue(80, 20)),
        light: Math.round(generateSensorValue(1000, 500)),
      });
    }
    
    return initialData;
  });

  const updateSensorData = useCallback(() => {
    const now = new Date();
    
    // Generate new values based on previous values for smooth transitions
    const newTemp = Math.round(generateSensorValue(28, 10, prevValues.current.temp));
    const newHumidity = Math.round(generateSensorValue(80, 20, prevValues.current.humidity));
    const newLight = Math.round(generateSensorValue(1000, 500, prevValues.current.light));

    // Update previous values
    prevValues.current = {
      temp: newTemp,
      humidity: newHumidity,
      light: newLight,
    };

    // Update current sensor data
    setSensorData({
      temperature: newTemp,
      humidity: newHumidity,
      light: newLight,
      lastUpdated: now,
    });

    // Update chart data
    const timeString = now.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });

    setChartData(prev => {
      const newData = [...prev, {
        time: timeString,
        temperature: newTemp,
        humidity: newHumidity,
        light: newLight,
      }];
      
      // Keep only last MAX_DATA_POINTS
      if (newData.length > MAX_DATA_POINTS) {
        return newData.slice(-MAX_DATA_POINTS);
      }
      return newData;
    });
  }, []);

  useEffect(() => {
    // Update every 2 seconds
    const interval = setInterval(updateSensorData, 2000);
    
    return () => clearInterval(interval);
  }, [updateSensorData]);

  return {
    sensorData,
    chartData,
  };
};
