"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { useTheme } from "@/app/providers/theme-provider";
import { cn } from "@/lib/utils";

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

// Use useSyncExternalStore for hydration-safe mounting check
function useIsMounted() {
  return useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );
}

export function ThemeToggle({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) {
  const { setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const mounted = useIsMounted();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;

    const newTheme = !isDark;

    // Use View Transition API if available
    if (document.startViewTransition) {
      await document.startViewTransition(() => {
        flushSync(() => {
          setIsDark(newTheme);
          document.documentElement.classList.toggle("dark");
          setTheme(newTheme ? "dark" : "light");
        });
      }).ready;

      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    } else {
      // Fallback for browsers without View Transition API
      setIsDark(newTheme);
      document.documentElement.classList.toggle("dark");
      setTheme(newTheme ? "dark" : "light");
    }
  }, [isDark, duration, setTheme]);

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          "group relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground",
          className
        )}
        aria-label="Toggle theme"
        {...props}
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      className={cn(
        "group relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-lux-base hover:border-primary/40 hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background",
        className
      )}
      aria-label="Toggle theme"
      {...props}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-all duration-lux-base group-hover:text-amber-500" />
      ) : (
        <Moon className="h-4 w-4 transition-all duration-lux-base" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
