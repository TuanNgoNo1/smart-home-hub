import { Home, Wifi, WifiOff, Settings, Database, History, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationProps {
  isConnected: boolean;
}

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/data-sensor", label: "Data Sensor", icon: Database },
  { path: "/action-history", label: "Action History", icon: History },
  { path: "/profile", label: "Profile", icon: User },
];

export const Navigation = ({ isConnected }: NavigationProps) => {
  const location = useLocation();

  return (
    <header className="dashboard-header">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Smart Home</h1>
                <p className="text-xs text-muted-foreground">IoT Dashboard</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className={`status-badge ${isConnected ? 'status-badge-success' : 'status-badge-error'}`}>
              {isConnected ? (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Disconnected</span>
                </>
              )}
            </div>
            
            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
