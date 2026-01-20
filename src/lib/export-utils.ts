import { SensorRecord } from "@/types/sensor";
import { ActionRecord } from "@/types/action";
import { format } from "date-fns";

// Sensor data export
export const exportSensorDataToCSV = (data: SensorRecord[], filename?: string) => {
  const sensorTypeLabels: Record<string, string> = {
    temperature: "Nhiệt độ",
    humidity: "Độ ẩm",
    light: "Ánh sáng",
  };

  const sensorUnits: Record<string, string> = {
    temperature: "°C",
    humidity: "%",
    light: "lux",
  };

  const headers = ["ID", "Loại cảm biến", "Giá trị", "Đơn vị", "Thời gian"];
  
  const rows = data.map((record) => [
    record.id,
    sensorTypeLabels[record.sensorType] || record.sensorType,
    record.value.toString(),
    sensorUnits[record.sensorType] || "",
    format(new Date(record.timestamp), "dd/MM/yyyy HH:mm:ss"),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  downloadFile(csvContent, filename || `sensor-data-${format(new Date(), "yyyyMMdd-HHmmss")}.csv`, "text/csv");
};

// Action history export
export const exportActionHistoryToCSV = (data: ActionRecord[], filename?: string) => {
  const deviceTypeLabels: Record<string, string> = {
    light: "Đèn",
    fan: "Quạt",
    ac: "Điều hòa",
  };

  const actionLabels: Record<string, string> = {
    on: "BẬT",
    off: "TẮT",
  };

  const statusLabels: Record<string, string> = {
    success: "Thành công",
    waiting: "Đang xử lý",
    failed: "Lỗi",
  };

  const headers = ["ID", "Thiết bị", "Hành động", "Trạng thái", "Thời gian"];
  
  const rows = data.map((record) => [
    record.id,
    deviceTypeLabels[record.deviceType] || record.deviceType,
    actionLabels[record.action] || record.action,
    statusLabels[record.status] || record.status,
    format(new Date(record.timestamp), "dd/MM/yyyy HH:mm:ss"),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  downloadFile(csvContent, filename || `action-history-${format(new Date(), "yyyyMMdd-HHmmss")}.csv`, "text/csv");
};

// Excel export (using CSV with BOM for Excel compatibility)
export const exportSensorDataToExcel = (data: SensorRecord[], filename?: string) => {
  const sensorTypeLabels: Record<string, string> = {
    temperature: "Nhiệt độ",
    humidity: "Độ ẩm",
    light: "Ánh sáng",
  };

  const sensorUnits: Record<string, string> = {
    temperature: "°C",
    humidity: "%",
    light: "lux",
  };

  const headers = ["ID", "Loại cảm biến", "Giá trị", "Đơn vị", "Thời gian"];
  
  const rows = data.map((record) => [
    record.id,
    sensorTypeLabels[record.sensorType] || record.sensorType,
    record.value.toString(),
    sensorUnits[record.sensorType] || "",
    format(new Date(record.timestamp), "dd/MM/yyyy HH:mm:ss"),
  ]);

  // Add BOM for Excel UTF-8 compatibility
  const BOM = "\uFEFF";
  const csvContent = BOM + [
    headers.join("\t"),
    ...rows.map((row) => row.join("\t")),
  ].join("\n");

  downloadFile(csvContent, filename || `sensor-data-${format(new Date(), "yyyyMMdd-HHmmss")}.xls`, "application/vnd.ms-excel");
};

export const exportActionHistoryToExcel = (data: ActionRecord[], filename?: string) => {
  const deviceTypeLabels: Record<string, string> = {
    light: "Đèn",
    fan: "Quạt",
    ac: "Điều hòa",
  };

  const actionLabels: Record<string, string> = {
    on: "BẬT",
    off: "TẮT",
  };

  const statusLabels: Record<string, string> = {
    success: "Thành công",
    waiting: "Đang xử lý",
    failed: "Lỗi",
  };

  const headers = ["ID", "Thiết bị", "Hành động", "Trạng thái", "Thời gian"];
  
  const rows = data.map((record) => [
    record.id,
    deviceTypeLabels[record.deviceType] || record.deviceType,
    actionLabels[record.action] || record.action,
    statusLabels[record.status] || record.status,
    format(new Date(record.timestamp), "dd/MM/yyyy HH:mm:ss"),
  ]);

  // Add BOM for Excel UTF-8 compatibility
  const BOM = "\uFEFF";
  const csvContent = BOM + [
    headers.join("\t"),
    ...rows.map((row) => row.join("\t")),
  ].join("\n");

  downloadFile(csvContent, filename || `action-history-${format(new Date(), "yyyyMMdd-HHmmss")}.xls`, "application/vnd.ms-excel");
};

// Helper function to trigger file download
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
