import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="layout-container layout-section">
      <div className="layout-stack">
        <div className="flex items-center gap-3">
          <div className="bg-lux-gold-soft flex h-12 w-12 items-center justify-center rounded-xl">
            <HelpCircle className="h-6 w-6 text-lux-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Help</h1>
            <p className="text-sm text-muted-foreground">
              Documentation and support resources
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-lux bg-lux-surface p-8 text-center">
          <p className="text-muted-foreground">
            Help documentation coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
