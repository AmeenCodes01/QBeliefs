import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `suppressHydrationWarning` only affects the html tag,
    // and is needed by `ThemeProvider` which sets the theme
    // class attribute on it
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased h-screen flex flex-col ">
        <ThemeProvider attribute="class">
          <div className="flex-1 flex flex-col ">
            <Header />
            <div className="px-4 py-2 flex-1 overflow-auto flex-col w-full    ">
              <div className="flex-1  justify-center items-center w-full flex flex-col">
                <div className="px-4 py-2 flex-1 overflow-auto w-full  max-w-7xl justify-center ">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
