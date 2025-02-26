import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";
import Header from "@/components/Header";
import localFont from 'next/font/local'
import ConvexClientProvider from "@/components/ConvexClientProvider";


import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";


const myFont = localFont({
  src: './font.ttf',
  display: 'swap',
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
    <html lang="en" suppressHydrationWarning={true} className={myFont.className} >
  <body className="antialiased h-screen flex flex-col bg-hover">
    
    <ConvexClientProvider>
      <ThemeProvider attribute="class">

        {/* Layout Container */}
        <div className="flex flex-col h-screen overflow-hidden">
          
          {/* Sticky Header */}
          <Header  />

          {/* Main Content (Scrollable) */}
          <div className="flex flex-1 overflow-hidden justify-center">
            <div className="flex flex-1 flex-col max-w-7xl  overflow-hidden">
              {children}
            </div>
          </div>

        </div>

      </ThemeProvider>
    </ConvexClientProvider>
  </body>
</html>
    </ConvexAuthNextjsServerProvider>

  );
}
