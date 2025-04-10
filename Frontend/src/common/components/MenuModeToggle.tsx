import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/common/components/ThemeProvider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function MenuModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="w-full">
      <ToggleGroup
        type="single"
        variant="outline"
        size="lg"
        defaultValue={theme}
        className="grid grid-cols-3 gap-1 mx-auto"
      >
        <ToggleGroupItem
          value="light"
          aria-label="Toggle bold"
          className="bg-input rounded-md"
          size="lg"
          onClick={() => setTheme("light")}
        >
          <Sun className="h-[2.2rem] w-[2.2rem] rotate-0 scale-100 transition-all fill-amber-600 dark:-rotate-90 dark:fill-inherit" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="system"
          aria-label="Toggle italic"
          className="bg-input rounded-md"
          size="lg"
          onClick={() => setTheme("system")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="dark"
          aria-label="Toggle strikethrough"
          className="bg-input rounded-md"
          size="lg"
          onClick={() => setTheme("dark")}
        >
          <Moon
            className="absolute h-[1.2rem] w-[1.2rem] rotate-240 transition-all 
          dark:fill-blue-600 dark:rotate-0 fill-inherit"
          />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
