import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Header from "./src/components/generals/Header";
import Footer from "./src/components/generals/Footer";
import WhatsAppButtonWrapper from "./src/components/generals/WhatsAppButtonWrapper";
import ErrorBoundary from "./src/components/generals/ErrorBoundary";
import "./globals.css";
import { FilterProvider } from "./src/state/FiltersContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InDise",
  description: "Empresa constructora de Colombia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <FilterProvider>
            <Header />
            <main role="main" id="main-content">
              {children}
            </main>
            <Footer />
            <WhatsAppButtonWrapper />
          </FilterProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}