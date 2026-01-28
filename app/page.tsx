import Link from "next/link";
import {
  ArrowRight,
  CheckSquare,
  MessageSquare,
  Video,
  LayoutDashboard,
} from "lucide-react";
import { ThemeToggle } from "./components/theme-toggle";

export default function Home() {
  return (
    <div className="bg-lux-paper min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="layout-container layout-cluster py-4">
          <Link
            href="/"
            className="text-lg font-semibold text-foreground hover:text-lux-gold transition-colors duration-lux-base"
          >
            AXIS-AFENDA
          </Link>
          <nav className="layout-cluster ml-auto gap-6">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-lux-fast"
            >
              Features
            </Link>
            <Link
              href="#stats"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-lux-fast"
            >
              Platform
            </Link>
            <Link
              href="/app"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-lux-fast"
            >
              Dashboard
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="layout-container layout-hero layout-stack-loose">
          <span className="badge-lux-solid w-fit rounded-md px-3 py-1 text-xs font-medium">
            Enterprise orchestration
          </span>
          <h1 className="text-hero-lux max-w-2xl text-4xl sm:text-5xl lg:text-6xl">
            Approvals, omnichannel, and collaboration in one place.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            A unified shell that connects Keycloak, Chatwoot, Matrix, and Jitsi.
            Clone + integrate — minimal orchestration, maximum control.
          </p>
          <div className="layout-cluster gap-4">
            <Link
              href="/app"
              className="btn-gold-lux inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-lux"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-lg border border-lux bg-background px-5 py-2.5 text-sm font-medium text-foreground transition duration-lux-base hover:bg-muted"
            >
              See features
            </Link>
          </div>
        </section>

        <hr className="rule-lux layout-container w-full" />

        {/* Features */}
        <section id="features" className="layout-container layout-section">
          <div className="layout-stack-loose">
            <h2 className="text-2xl font-semibold text-foreground">Features</h2>
            <div className="layout-grid-3">
              <div className="card-glow-lux bg-lux-surface rounded-xl border border-lux p-6 shadow-lux layout-stack">
                <div className="bg-lux-gold-soft flex h-10 w-10 items-center justify-center rounded-lg">
                  <CheckSquare className="h-5 w-5 text-lux-gold" />
                </div>
                <h3 className="font-semibold text-foreground">Approvals</h3>
                <p className="text-sm text-muted-foreground">
                  CEO approval workflow, audit trail, and tenant-scoped requests.
                </p>
              </div>
              <div className="card-glow-lux bg-lux-surface rounded-xl border border-lux p-6 shadow-lux layout-stack">
                <div className="bg-lux-gold-soft flex h-10 w-10 items-center justify-center rounded-lg">
                  <MessageSquare className="h-5 w-5 text-lux-gold" />
                </div>
                <h3 className="font-semibold text-foreground">Omnichannel</h3>
                <p className="text-sm text-muted-foreground">
                  Chatwoot integration. Escalate to approval, then consult.
                </p>
              </div>
              <div className="card-glow-lux bg-lux-surface rounded-xl border border-lux p-6 shadow-lux layout-stack">
                <div className="bg-lux-gold-soft flex h-10 w-10 items-center justify-center rounded-lg">
                  <Video className="h-5 w-5 text-lux-gold" />
                </div>
                <h3 className="font-semibold text-foreground">Consultations</h3>
                <p className="text-sm text-muted-foreground">
                  Jitsi rooms on approval. Matrix for team chat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats / KPIs */}
        <section id="stats" className="layout-container layout-section-tight">
          <div className="layout-grid-3">
            <div className="rounded-xl border border-kpi-up-bd bg-kpi-up-bg px-6 py-4 text-kpi-up-fg">
              <p className="text-sm font-medium">Approval rate</p>
              <p className="text-2xl font-bold">94%</p>
            </div>
            <div className="rounded-xl border border-kpi-flat-bd bg-kpi-flat-bg px-6 py-4 text-kpi-flat-fg">
              <p className="text-sm font-medium">Active tenants</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="rounded-xl border border-kpi-down-bd bg-kpi-down-bg px-6 py-4 text-kpi-down-fg">
              <p className="text-sm font-medium">Avg. resolve time</p>
              <p className="text-2xl font-bold">−18%</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="layout-container layout-section-loose">
          <div className="layout-stack layout-container-narrow text-center">
            <hr className="rule-lux w-full" />
            <h2 className="text-2xl font-semibold text-foreground">
              Ready to unify your stack?
            </h2>
            <p className="text-muted-foreground">
              Shell app, orchestrator API, and Keycloak SSOT. Start with the MVP
              loop: inbox → escalate → approve → log.
            </p>
            <div className="flex justify-center">
              <Link
                href="/app"
                className="btn-gold-lux inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium shadow-lux"
              >
                <LayoutDashboard className="h-4 w-4" />
                Open Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="layout-footer mt-auto">
        <div className="layout-container layout-cluster">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AXIS-AFENDA. Built with Next.js,
            Hono, and the design system.
          </p>
          <nav className="layout-cluster ml-auto gap-6">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-lux-fast"
            >
              Features
            </Link>
            <Link
              href="/app"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-lux-fast"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
