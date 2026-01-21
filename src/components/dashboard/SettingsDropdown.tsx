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
import { Button } from "@/components/ui/button";

export const SettingsDropdown = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-9 w-9"
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Cài đặt</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 z-[100]">
        <DropdownMenuLabel>Cài đặt</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center justify-between cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-2">
            {isDark ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
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
