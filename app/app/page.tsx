import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "../components/theme-toggle";

export default function AppPage() {
  return (
    <div className="bg-lux-paper min-h-screen">
      <header className="border-b border-border bg-background">
        <div className="layout-container layout-cluster py-4">
          <Link
            href="/"
            className="text-lg font-semibold text-foreground hover:text-lux-gold transition-colors duration-lux-base"
          >
            AXIS-AFENDA
          </Link>
          <div className="layout-cluster ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="layout-container layout-section">
        <div className="layout-stack layout-container-narrow text-center">
          <div className="bg-lux-gold-soft mx-auto flex h-14 w-14 items-center justify-center rounded-xl">
            <LayoutDashboard className="h-7 w-7 text-lux-gold" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Shell app, sidebar, and module registry coming next. Head back to the{" "}
            <Link href="/" className="font-medium text-primary hover:underline">
              landing page
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
