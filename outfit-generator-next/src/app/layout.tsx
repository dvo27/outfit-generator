import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Sidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({
  subsets: ['latin']
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Outfit Generator",
  description: "Generate outfits from your own clothes",
  icons: {
    icon: '/logo.jpeg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <Providers>
          <SidebarProvider>
            <div className="flex min-h-screen gap-0">
              <Sidebar />
              <main className="flex-1 lg:ml-0 transition-all duration-300 p-0 m-0">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
