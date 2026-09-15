import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Press_Start_2P, Silkscreen } from "next/font/google";
import { profile } from "@/data/content";
import "./globals.css";

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.summary.slice(0, 200),
  keywords: [
    "Ved Patel",
    "Software Engineer",
    "AI Agents",
    "Python",
    "Azure",
    "University of South Florida",
  ],
  authors: [{ name: profile.fullName, url: profile.linkedin }],
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#12131f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables must live on <html>, not <body>: Tailwind declares
    // --font-display/--font-pixel/--font-mono on :root, and a var() inside a
    // custom property is substituted on the element that declares it. Defining
    // them lower down would leave those theme tokens invalid.
    <html
      lang="en"
      className={`${pressStart.variable} ${silkscreen.variable} ${jetbrains.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
