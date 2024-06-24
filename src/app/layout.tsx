import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Inter as FontSans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "@knocklabs/react/dist/index.css";

import { cn } from "@/lib/utils"
import { Header } from "./header";
import { AppKnockProviders } from "./knock-provider";
import { SessionProvider } from "next-auth/react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auclify",
  description: "Item bidding platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <AppKnockProviders>
              <Header />
              {children}
            </AppKnockProviders>
          </SessionProvider>
          
        </ThemeProvider>
      </body>
    </html>
  );
}
