"use client";

import * as React from "react";

type CommandPaletteContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CommandPaletteContext = React.createContext<CommandPaletteContextType | undefined>(undefined);

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if (
        (e.key === "k" || e.key === "K") &&
        (e.metaKey || e.ctrlKey) &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        e.stopPropagation();
        setOpen((prev) => !prev);
      }
      // Also handle Escape to close
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };

    // Use capture phase to ensure we catch the event early
    document.addEventListener("keydown", down, true);
    return () => document.removeEventListener("keydown", down, true);
  }, [open]);

  const value = React.useMemo(
    () => ({ open, setOpen }),
    [open]
  );

  return React.createElement(
    CommandPaletteContext.Provider,
    { value },
    children
  );
}

export function useCommandPalette() {
  const context = React.useContext(CommandPaletteContext);
  if (context === undefined) {
    throw new Error("useCommandPalette must be used within a CommandPaletteProvider");
  }
  return context;
}
