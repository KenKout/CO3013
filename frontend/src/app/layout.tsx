import type { Metadata } from "next";
import { Orbitron, Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/useAuth";

const orbitron = Orbitron({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const roboto = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Study Space - Find Your Perfect Study Space",
  description: "Book comfortable and quiet spaces across campus for your study sessions, group projects, or solo work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${orbitron.variable} ${roboto.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="study-space-theme"
        >
          <AuthProvider>
            {children}
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
