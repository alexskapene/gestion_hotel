import type { Metadata } from "next";
import { Poppins, DM_Sans } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { HotelDetailModal } from "@/components/HotelDetailModal";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zua Place",
  description:
    "Découvrez et réservez les meilleurs hôtels de la province d'Ituri en République Démocratique du Congo. Réservation facile avec paiement mobile.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${poppins.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground flex min-h-screen flex-col">
        <AuthProvider>
          <AppProvider>
            <main className="flex-1">{children}</main>
            <HotelDetailModal />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
