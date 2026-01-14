import { useState, useEffect } from "react";
import { Navigation } from "@/components/shared/Navigation";
import { ActionFilterBar } from "@/components/action-history/ActionFilterBar";
import { ActionDataTable } from "@/components/action-history/ActionDataTable";
import { ActionPagination } from "@/components/action-history/ActionPagination";
import { useActionHistory } from "@/hooks/useActionHistory";
import { History, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ActionHistory = () => {
  const [isConnected] = useState(true);
  const { data, isLoading, pagination, filters, updateFilters, refresh } = useActionHistory();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh every 30 seconds when on page 1
  useEffect(() => {
    if (filters.page === 1) {
      const interval = setInterval(() => {
        refresh();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [filters.page, refresh]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isConnected={isConnected} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <History className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Action History</h1>
              <p className="text-sm text-muted-foreground">Lịch sử bật/tắt thiết bị</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>
        </div>

        {/* Filter Bar */}
        <ActionFilterBar filters={filters} onFilterChange={updateFilters} />

        {/* Data Table */}
        <ActionDataTable data={data} isLoading={isLoading} />

        {/* Pagination */}
        {!isLoading && pagination.total > 0 && (
          <ActionPagination
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

// Helper function for className
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default ActionHistory;
