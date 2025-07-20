import "./globals.css";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import Header from "./_components/Header";

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "Streamly",
  description: "Your no.1 movies data site",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
