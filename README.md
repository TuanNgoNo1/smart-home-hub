# 🏠 Hệ Thống Giám Sát và Điều Khiển Thiết Bị IoT Thông Minh

> **Smart Home IoT Dashboard** - Giám sát cảm biến và điều khiển thiết bị thời gian thực

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Giới Thiệu

Hệ thống IoT cho phép giám sát và điều khiển thiết bị thông minh từ xa qua giao diện web. Dự án được xây dựng cho môn học **Internet of Things (IoT)** với các tính năng:

- 🌡️ **Giám sát Real-time:** Nhiệt độ, Độ ẩm, Ánh sáng (cập nhật mỗi 2 giây)
- 💡 **Điều khiển Thiết bị:** Đèn, Quạt, Điều hòa (với xác nhận trạng thái)
- 📊 **Biểu đồ Trực quan:** Line chart theo thời gian thực
- 📜 **Lịch sử Dữ liệu:** Tìm kiếm, lọc, phân trang
- 🔍 **Lịch sử Hành động:** Theo dõi mọi thao tác điều khiển

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Frontend   │◄────►│   Backend   │◄────►│  Hardware   │
│  (React)    │ HTTP │  (Node.js)  │ MQTT │ (ESP8266)   │
│             │      │             │      │             │
│  • Dashboard│      │  • REST API │      │  • DHT11    │
│  • Charts   │      │  • MQTT Sub │      │  • LDR      │
│  • History  │      │  • MySQL    │      │  • 3x LED   │
└─────────────┘      └─────────────┘      └─────────────┘
```

---

## 🚀 Cài Đặt và Chạy

### Yêu Cầu

- Node.js 18+ và npm
- MySQL 8.0+
- Mosquitto MQTT Broker
- ESP8266/ESP32 (cho phần cứng)

### Bước 1: Clone Repository

```bash
git clone https://github.com/your-username/smart-home-iot.git
cd smart-home-iot
```

### Bước 2: Cài Đặt Dependencies

```bash
npm install
```

### Bước 3: Cấu Hình Environment

Tạo file `.env` trong thư mục gốc:

```env
# Database
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000

# MQTT (cho backend)
MQTT_HOST=localhost
MQTT_PORT=1884
MQTT_USERNAME=YourFullName
MQTT_PASSWORD=your_password
```

### Bước 4: Khởi Động Development Server

```bash
npm run dev
```

Mở trình duyệt tại: `http://localhost:5173`

---

## 📁 Cấu Trúc Thư Mục

```
smart-home-iot/
├── src/
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard cards, charts
│   │   ├── sensor-history/  # Data sensor table
│   │   ├── action-history/  # Action history table
│   │   └── ui/              # shadcn/ui components
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Dashboard page
│   │   ├── DataSensor.tsx   # Sensor history page
│   │   ├── ActionHistory.tsx
│   │   └── Profile.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useSensorData.ts
│   │   ├── useDeviceControl.ts
│   │   └── useActionHistory.ts
│   ├── contexts/            # React contexts
│   ├── types/               # TypeScript types
│   └── lib/                 # Utilities
├── public/                  # Static assets
├── REQUIREMENTS.md          # Yêu cầu môn học
├── SRS.md                   # Software Requirements Specification
└── README.md                # This file
```

---

## 🎨 Công Nghệ Sử Dụng

### Frontend

- **React 18.3** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool
- **TailwindCSS 3.4** - Styling
- **shadcn/ui** - Component library
- **Recharts 2.15** - Charts
- **React Query** - Data fetching
- **React Router 6** - Routing

### Backend (Riêng biệt)

- **Node.js + Express** - REST API
- **MQTT.js** - MQTT client
- **MySQL2** - Database driver
- **Socket.io** - WebSocket (optional)

### Hardware

- **ESP8266/ESP32** - Microcontroller
- **DHT11** - Temperature & Humidity sensor
- **LDR** - Light sensor
- **3x LED** - Device simulation

---

## 📊 Chức Năng Chính

### 1. Dashboard (Trang Chủ)

- **3 Card Cảm biến:** Hiển thị giá trị real-time với gradient đẹp
- **Biểu đồ Line Chart:** 3 đường màu theo thời gian
- **3 Nút Điều khiển:** OFF → LOADING → ON (với hiệu ứng)

### 2. Data Sensor (Lịch sử Cảm biến)

- Bảng dữ liệu với ID, Loại, Giá trị, Đơn vị, Thời gian
- Tìm kiếm theo keyword
- Lọc theo loại cảm biến và khoảng thời gian
- Phân trang (10/25/50/100 bản ghi/trang)

### 3. Action History (Lịch sử Hành động)

- Bảng lịch sử với Thiết bị, Action, Status, Thời gian
- Phân biệt Action (yêu cầu) vs Status (kết quả)
- Lọc theo thiết bị và thời gian
- Phân trang

### 4. Profile (Hồ sơ)

- Thông tin sinh viên (Họ tên, MSSV, Lớp)
- Link báo cáo PDF
- Link API Documentation
- Link Git Repository

---

## 🔧 Scripts

```bash
# Development
npm run dev              # Chạy dev server (port 5173)

# Build
npm run build            # Build production
npm run preview          # Preview production build

# Linting
npm run lint             # Check code quality
```

---

## 📡 API Endpoints (Backend)

### Sensor Data

- `GET /api/sensors` - Danh sách cảm biến
- `GET /api/data-sensor/latest` - Dữ liệu mới nhất
- `GET /api/data-sensor?page=1&limit=10` - Lịch sử (phân trang)
- `GET /api/data-sensor/chart?minutes=1` - Dữ liệu biểu đồ

### Device Control

- `GET /api/devices` - Danh sách thiết bị
- `POST /api/device/control` - Điều khiển thiết bị
- `GET /api/device/status/:id` - Trạng thái hiện tại

### Action History

- `GET /api/action-history?page=1&limit=10` - Lịch sử hành động

---

## 🔌 MQTT Topics

| Topic            | Direction          | Payload                              |
| ---------------- | ------------------ | ------------------------------------ |
| `data_sensor`    | Hardware → Backend | `{temp:28, humidity:80, light:1000}` |
| `device_control` | Backend → Hardware | `{device_id:1, action:"ON"}`         |
| `device_status`  | Hardware → Backend | `{device_id:1, status:"ON"}`         |

---

## 🗄️ Database Schema

```sql
-- 4 bảng chính
sensors          (id, name, unit, created_at)
data_sensor      (id, sensor_id, value, timestamp)
devices          (id, name, type, created_at)
action_history   (id, device_id, action, status, timestamp)
```

Chi tiết xem file: [SRS.md](SRS.md)

---

## 📝 Tài Liệu

- **[REQUIREMENTS.md](REQUIREMENTS.md)** - Yêu cầu môn học chi tiết
- **[SRS.md](SRS.md)** - Software Requirements Specification
- **Figma Design:** [Link Figma](https://figma.com/...)
- **API Documentation:** [Link Postman](https://postman.com/...)

---

## 🎯 Roadmap

- [x] Thiết kế giao diện Figma (4 màn hình)
- [x] Viết tài liệu SRS
- [ ] Lập trình phần cứng ESP8266
- [ ] Xây dựng Backend API
- [ ] Tích hợp MQTT
- [ ] Hoàn thiện Frontend
- [ ] Testing và Debug
- [ ] Bảo vệ đồ án

---

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 🙏 Lời Cảm Ơn

- Thầy giáo hướng dẫn môn IoT
- Cộng đồng React và TypeScript
- shadcn/ui cho component library tuyệt vời

---

**⭐ Nếu thấy dự án hữu ích, hãy cho một star nhé!**
