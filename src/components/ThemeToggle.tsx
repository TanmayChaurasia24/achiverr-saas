
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("rounded-full group", className)}
      disabled
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, 10, 0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
      >
        <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-400" />
      </motion.div>
      <span className="sr-only">Dark theme</span>
    </Button>
  );
}
