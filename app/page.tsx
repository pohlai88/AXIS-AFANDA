import Link from "next/link";
import {
  ArrowRight,
  CheckSquare,
  MessageSquare,
  LayoutDashboard,
  StickyNote,
  PenTool,
  Calendar,
  Users,
  Compass,
  Grid3x3,
  Smartphone,
  Lock,
  AlertCircle,
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
            The compass for work&apos;s morphology
          </span>
          <h1 className="text-hero-lux max-w-2xl text-4xl sm:text-5xl lg:text-6xl">
            Life is chaos, but work doesn&apos;t have to be.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            <strong>AXIS</strong> provides direction. <strong>AFENDA</strong> provides structure.
            Together, we solve today&apos;s workforce pain: hundreds of apps, social media invasion,
            and nothing belonging to ourselves. Work peacefully. Leave notes silently.
            Work tools stay in work — WhatsApp stays WhatsApp, Instagram stays Instagram.
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

        {/* Pain Points */}
        <section className="layout-container layout-section">
          <div className="layout-stack-loose">
            <h2 className="text-2xl font-semibold text-foreground">
              Today&apos;s Workforce Pain Points
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Teams are drowning in app chaos, social media invasion, and loss of data ownership.
              We solve these problems with clear boundaries and peaceful collaboration.
            </p>
            <div className="layout-grid-3">
              <div className="card-glow-lux bg-lux-surface rounded-xl border border-lux p-6 shadow-lux layout-stack">
                <div className="bg-reject-bg flex h-10 w-10 items-center justify-center rounded-lg">
                  <Smartphone className="h-5 w-5 text-reject-fg" />
                </div>
                <h3 className="font-semibold text-foreground">Multi-Hundred App Chaos</h3>
                <p className="text-sm text-muted-foreground">
                  Teams use 100+ apps. Constant context switching destroys focus.
                  Information scattered everywhere. No single source of truth.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Our solution:</strong> One work shell that orchestrates work tools.
                  Clear boundaries. Work tools stay in work.
                </p>
              </div>
              <div className="card-glow-lux bg-lux-surface rounded-xl border border-lux p-6 shadow-lux layout-stack">
                <div className="bg-status-warn-bg flex h-10 w-10 items-center justify-center rounded-lg">
                  <AlertCircle className="h-5 w-5 text-status-warn-fg" />
                </div>
                <h3 className="font-semibold text-foreground">Social Media Invasion</h3>
                <p className="text-sm text-muted-foreground">
                  Personal social media bleeds into work. No clear boundaries.
                  Distractions everywhere. Privacy concerns.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Our solution:</strong> Work-life separation. WhatsApp stays WhatsApp,
                  Instagram stays Instagram. Work tools only in AXIS-AFENDA.
                </p>
              </div>
              <div className="card-glow-lux bg-lux-surface rounded-xl border border-lux p-6 shadow-lux layout-stack">
                <div className="bg-status-warn-bg flex h-10 w-10 items-center justify-center rounded-lg">
                  <Lock className="h-5 w-5 text-status-warn-fg" />
                </div>
                <h3 className="font-semibold text-foreground">Nothing Belongs to Ourselves</h3>
                <p className="text-sm text-muted-foreground">
                  Data scattered across platforms we don&apos;t control. Vendor lock-in.
                  Privacy violations. No ownership of our work.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Our solution:</strong> Self-hostable, open architecture.
                  Own your data. Export capabilities. No vendor lock-in.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="rule-lux layout-container w-full" />

        {/* Brand Meaning */}
        <section className="layout-container layout-section">
          <div className="layout-stack-loose">
            <h2 className="text-2xl font-semibold text-foreground">
              The Compass for Work&apos;s Morphology
            </h2>
            <div className="layout-grid-2">
              <div className="card-glow-lux bg-lux-surface rounded-xl border border-lux p-6 shadow-lux layout-stack">
                <div className="bg-lux-gold-soft flex h-10 w-10 items-center justify-center rounded-lg">
                  <Compass className="h-5 w-5 text-lux-gold" />
                </div>
                <h3 className="font-semibold text-foreground text-lg">AXIS</h3>
                <p className="text-sm text-muted-foreground">
                  The X and Y coordinates. The compass that gives direction.
                </p>
                <p className="text-sm text-foreground mt-2">
                  <strong>Navigation</strong> through complexity. <strong>Direction</strong> when
                  everything is chaotic. <strong>Coordinates</strong> for precise positioning.
                  The axis around which work revolves.
                </p>
                <p className="text-xs text-muted-foreground mt-3 italic">
                  &quot;AXIS provides direction and structure when everything else is chaotic.&quot;
                </p>
              </div>
              <div className="card-glow-lux bg-lux-surface rounded-xl border border-lux p-6 shadow-lux layout-stack">
                <div className="bg-lux-gold-soft flex h-10 w-10 items-center justify-center rounded-lg">
                  <Grid3x3 className="h-5 w-5 text-lux-gold" />
                </div>
                <h3 className="font-semibold text-foreground text-lg">AFENDA</h3>
                <p className="text-sm text-muted-foreground">
                  The morphology of work — the form, structure, and organization of work itself.
                </p>
                <p className="text-sm text-foreground mt-2">
                  <strong>Structure</strong> and organization. <strong>Morphology</strong> — how
                  work takes shape and evolves. Transforming <strong>chaos into order</strong>.
                  The very essence of organized work.
                </p>
                <p className="text-xs text-muted-foreground mt-3 italic">
                  &quot;AFENDA understands the morphology of work — how work flows, how it&apos;s structured,
                  how it should be organized.&quot;
                </p>
              </div>
            </div>
            <div className="mt-6 p-6 rounded-xl bg-lux-gold-soft/20 border border-lux-gold/30">
              <p className="text-center text-foreground font-medium">
                Together: <strong>AXIS</strong> provides direction. <strong>AFENDA</strong> provides structure.
                We give you the compass to navigate work&apos;s complexity.
              </p>
            </div>
          </div>
        </section>

        <hr className="rule-lux layout-container w-full" />

        {/* Features */}
        <section id="features" className="layout-container layout-section">
          <div className="layout-stack-loose">
            <h2 className="text-2xl font-semibold text-foreground">Work Peacefully</h2>
            <p className="text-muted-foreground max-w-2xl">
              Collaborate without chaos. Leave notes silently. Work on whiteboards together.
              Have structured meetings and consultations. No constant texting required.
            </p>
            <div className="layout-grid-3">
              <div className="card-glow-lux bg-lux-surface rounded-xl border border-lux p-6 shadow-lux layout-stack">
                <div className="bg-lux-gold-soft flex h-10 w-10 items-center justify-center rounded-lg">
                  <StickyNote className="h-5 w-5 text-lux-gold" />
                </div>
                <h3 className="font-semibold text-foreground">Silent Team Notes</h3>
                <p className="text-sm text-muted-foreground">
                  Leave notes on team boards without texting. Collaborate asynchronously, peacefully.
                  No interruptions, no notifications.
                </p>
              </div>
              <div className="card-glow-lux bg-lux-surface rounded-xl border border-lux p-6 shadow-lux layout-stack">
                <div className="bg-lux-gold-soft flex h-10 w-10 items-center justify-center rounded-lg">
                  <PenTool className="h-5 w-5 text-lux-gold" />
                </div>
                <h3 className="font-semibold text-foreground">Collaborative Whiteboards</h3>
                <p className="text-sm text-muted-foreground">
                  Figma Jam-like drawing and ideation. Visual collaboration without talking.
                  Work peacefully on shared canvases.
                </p>
              </div>
              <div className="card-glow-lux bg-lux-surface rounded-xl border border-lux p-6 shadow-lux layout-stack">
                <div className="bg-lux-gold-soft flex h-10 w-10 items-center justify-center rounded-lg">
                  <Calendar className="h-5 w-5 text-lux-gold" />
                </div>
                <h3 className="font-semibold text-foreground">Structured Meetings</h3>
                <p className="text-sm text-muted-foreground">
                  Organized, transcribed, summarized. Clear agendas and outcomes.
                  Not chaotic, not noisy. Professional and focused.
                </p>
              </div>
              <div className="card-glow-lux bg-lux-surface rounded-xl border border-lux p-6 shadow-lux layout-stack">
                <div className="bg-lux-gold-soft flex h-10 w-10 items-center justify-center rounded-lg">
                  <Users className="h-5 w-5 text-lux-gold" />
                </div>
                <h3 className="font-semibold text-foreground">Consultation Rooms</h3>
                <p className="text-sm text-muted-foreground">
                  Scheduled, thoughtful consultations. Not impromptu chaos.
                  Structured, purposeful. Jitsi integration for quality video.
                </p>
              </div>
              <div className="card-glow-lux bg-lux-surface rounded-xl border border-lux p-6 shadow-lux layout-stack">
                <div className="bg-lux-gold-soft flex h-10 w-10 items-center justify-center rounded-lg">
                  <CheckSquare className="h-5 w-5 text-lux-gold" />
                </div>
                <h3 className="font-semibold text-foreground">Approvals</h3>
                <p className="text-sm text-muted-foreground">
                  CEO approval workflow, audit trail, and tenant-scoped requests.
                  Clear decisions, not confusion.
                </p>
              </div>
              <div className="card-glow-lux bg-lux-surface rounded-xl border border-lux p-6 shadow-lux layout-stack">
                <div className="bg-lux-gold-soft flex h-10 w-10 items-center justify-center rounded-lg">
                  <MessageSquare className="h-5 w-5 text-lux-gold" />
                </div>
                <h3 className="font-semibold text-foreground">Omnichannel</h3>
                <p className="text-sm text-muted-foreground">
                  Chatwoot integration. Escalate to approval, then consult.
                  Team chat available when needed, not by default.
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
              Ready to work peacefully?
            </h2>
            <p className="text-muted-foreground">
              Leave notes silently. Collaborate on whiteboards. Have structured meetings.
              Work without chaos. Life is chaos, but work doesn&apos;t have to be.
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
          <div className="layout-stack-tight">
            <p className="text-sm font-medium text-foreground">
              AXIS-AFENDA — The compass for work&apos;s morphology
            </p>
            <p className="text-xs text-muted-foreground">
              Life is chaos, but work doesn&apos;t have to be.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              © {new Date().getFullYear()} AXIS-AFENDA. Built with Next.js, Hono, and the design system.
            </p>
          </div>
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
