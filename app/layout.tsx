import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fredoka";
import "@fontsource-variable/nunito";
import "./globals.css";
import { PreferencesEffect, preferencesBootScript } from "@/components/layout/PreferencesEffect";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: {
    default: "DayQuest — Small Steps. Big Adventures.",
    template: "%s · DayQuest",
  },
  description:
    "DayQuest turns everyday routines into friendly, step-by-step learning adventures for children aged 4–8.",
  applicationName: "DayQuest",
  appleWebApp: { capable: true, title: "DayQuest", statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#fff8ec",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-text-size="normal" data-motion="system" data-contrast="normal" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferencesBootScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        {children}
        <PreferencesEffect />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
