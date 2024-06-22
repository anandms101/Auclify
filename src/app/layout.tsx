import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Inter as FontSans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"


import { cn } from "@/lib/utils"
import { Header } from "./header";

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
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
