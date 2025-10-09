import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
// [PASSO 1.2] - Importando o nosso provider
import { AppointmentsProvider } from './context/AppointmentsContext'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* [PASSO 1.2] - Envolvendo a aplicação com o provider */}
        <AppointmentsProvider>
          {children}
        </AppointmentsProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}