import { Settings, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

export const SettingsDropdown = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Cài đặt</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center justify-between cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-2">
            {isDark ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
            <span>Chế độ tối</span>
          </div>
          <Switch 
            checked={isDark} 
            onCheckedChange={toggleTheme}
            aria-label="Toggle dark mode"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
