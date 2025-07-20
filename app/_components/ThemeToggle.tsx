"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={setTheme}
        aria-label="Toggle Theme"
        className="p-2 rounded-full border border-border bg-muted hover:bg-primary/10 transition-colors"
      >
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Sun className="w-5 h-5 text-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Moon className="w-5 h-5 text-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <button
        onClick={setTheme}
        aria-label="Toggle Theme"
        className="p-2 rounded-full border border-border bg-muted hover:bg-primary/10 transition-colors"
      >
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Sun className="w-5 h-5 text-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Moon className="w-5 h-5 text-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </>
  );
}
