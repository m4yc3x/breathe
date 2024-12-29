import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from "sonner"
import { NextAuthProvider } from '@/components/providers/NextAuthProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Breathe',
  description: 'A beautiful dashboard for crackme submissions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <NextAuthProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  )
}

