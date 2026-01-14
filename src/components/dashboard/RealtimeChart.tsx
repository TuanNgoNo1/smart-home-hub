import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  light: number;
}

interface RealtimeChartProps {
  data: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-mono font-medium" style={{ color: entry.color }}>
              {entry.value}
              {entry.name === "Nhiệt độ" && "°C"}
              {entry.name === "Độ ẩm" && "%"}
              {entry.name === "Ánh sáng" && " lux"}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const RealtimeChart = ({ data }: RealtimeChartProps) => {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Biểu đồ thời gian thực</h2>
          <p className="text-sm text-muted-foreground">Cập nhật mỗi 2 giây</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sensor-temperature" />
            <span className="text-xs text-muted-foreground">Nhiệt độ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sensor-humidity" />
            <span className="text-xs text-muted-foreground">Độ ẩm</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sensor-light" />
            <span className="text-xs text-muted-foreground">Ánh sáng</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              vertical={false}
            />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 2000]}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temperature"
              name="Nhiệt độ"
              stroke="hsl(12, 90%, 62%)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "hsl(12, 90%, 62%)" }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="humidity"
              name="Độ ẩm"
              stroke="hsl(200, 95%, 60%)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "hsl(200, 95%, 60%)" }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="light"
              name="Ánh sáng"
              stroke="hsl(45, 95%, 55%)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "hsl(45, 95%, 55%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
