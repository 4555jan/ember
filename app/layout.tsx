import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Sparks } from "@/components/layout/Sparks";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Ember: hire AI creators", template: "%s · Ember" },
  description: "Post a brief, get matched with AI creators for images, video, copy, voice, 3D and automation. Pay when you approve.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Mono:wght@400;700&family=Caveat:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <main className="mx-auto max-w-[1060px] px-4 pb-16 pt-6">{children}</main>
        <Footer />
        <Sparks />
        <Toaster />
      </body>
    </html>
  );
}
