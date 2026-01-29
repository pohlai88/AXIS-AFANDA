import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { TenantProvider } from "@/app/providers/tenant-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Mock tenants for development (will be replaced with Keycloak later)
const mockTenants = [
  { id: "1", name: "Acme Corp", type: "org" as const },
  { id: "2", name: "Engineering Team", type: "team" as const },
  { id: "3", name: "John Doe", type: "individual" as const },
];

export const metadata: Metadata = {
  title: "AXIS-AFENDA — Enterprise orchestration",
  description: "Multi-tenant shell for approvals, omnichannel, and collaboration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider defaultTheme="system" enableSystem>
          <TenantProvider tenants={mockTenants} initialTenant={mockTenants[0]}>
            {children}
          </TenantProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
