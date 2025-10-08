import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AppointmentsProvider } from './context/AppointmentsContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import { AccessibilityModal } from '@/components/accessibility-modal'
import { ThemeInitializer } from '@/components/theme-initializer'

export const metadata: Metadata = {
  title: 'Clinic App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeInitializer />
        <AccessibilityProvider>
          <AppointmentsProvider>
            {children}
          </AppointmentsProvider>
          <AccessibilityModal />
        </AccessibilityProvider>
        <Analytics />
      </body>
    </html>
  )
}