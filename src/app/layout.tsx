import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
});

const ibmPlex = IBM_Plex_Mono({
  variable: "--font-ibm",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AET Banking Simulator | Build Your Virtual Empire",
    template: "%s | AET Banking Simulator",
  },
  description: "The ultimate realistic banking simulation game. Manage assets, climb global leaderboards, and build your virtual fortune in a high-stakes economy.",
  keywords: ["banking game", "economy simulator", "virtual wealth", "strategy game", "finance rpg", "AET bank", "virtual economy"],
  authors: [{ name: "AET Systems" }],
  creator: "AET Systems",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aet-bank.com",
    title: "AET Banking Simulator | The Future of Virtual Finance",
    description: "Join thousands of players in the most realistic banking simulation ever created. Secure your legacy.",
    siteName: "AET Banking Simulator",
    // images: [
    //   {
    //     url: "https://aet-bank.com/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "AET Banking Simulator",
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AET Banking Simulator",
    description: "Build your empire in the ultimate banking simulation game.",
    creator: "@aetbank",
    // images: ["https://aet-bank.com/twitter-image.jpg"],
  },
  metadataBase: new URL("https://aet-bank.com"), // Replace with actual domain whenever available
};

import { ScrollToTop } from "@/components/ui/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${sourceSans.variable} ${ibmPlex.variable} antialiased font-body`}
        suppressHydrationWarning
      >
        {children}
        <Toaster position="top-center" richColors />
        <ScrollToTop />
      </body>
    </html>
  );
}
