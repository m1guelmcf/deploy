import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
// [PASSO 1.2] - Importando o nosso provider
import { AppointmentsProvider } from "./context/AppointmentsContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { AccessibilityModal } from "@/components/accessibility-modal";
import { ThemeInitializer } from "@/components/theme-initializer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
                {/* [PASSO 1.2] - Envolvendo a aplicação com o provider */}
                <ThemeInitializer />
                <AccessibilityProvider>
                    <AppointmentsProvider>{children}</AppointmentsProvider>
                    <AccessibilityModal />
                </AccessibilityProvider>
                <Analytics />
                <Toaster />
            </body>
        </html>
    );
}
