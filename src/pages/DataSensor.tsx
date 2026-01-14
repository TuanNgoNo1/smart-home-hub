import { useState } from "react";
import { Navigation } from "@/components/shared/Navigation";
import { SensorFilterBar } from "@/components/sensor-history/SensorFilterBar";
import { SensorDataTable } from "@/components/sensor-history/SensorDataTable";
import { SensorPagination } from "@/components/sensor-history/SensorPagination";
import { useSensorHistory } from "@/hooks/useSensorHistory";
import { Database } from "lucide-react";

const DataSensor = () => {
  const [isConnected] = useState(true);
  const { data, isLoading, pagination, filters, updateFilters } = useSensorHistory();

  const handleSort = (column: "timestamp" | "value") => {
    if (filters.sortBy === column) {
      updateFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      updateFilters({ sortBy: column, sortOrder: "desc" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isConnected={isConnected} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Data Sensor</h1>
            <p className="text-sm text-muted-foreground">Lịch sử dữ liệu cảm biến</p>
          </div>
        </div>

        {/* Filter Bar */}
        <SensorFilterBar filters={filters} onFilterChange={updateFilters} />

        {/* Data Table */}
        <SensorDataTable
          data={data}
          isLoading={isLoading}
          onSort={handleSort}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
        />

        {/* Pagination */}
        {!isLoading && pagination.total > 0 && (
          <SensorPagination
            page={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            totalPages={pagination.totalPages}
            onPageChange={(page) => updateFilters({ page })}
            onPageSizeChange={(pageSize) => updateFilters({ pageSize, page: 1 })}
          />
        )}
      </main>
    </div>
  );
};

export default DataSensor;
