import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ContractAddressProvider } from "../components/context/ContractAddressContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "$TOP - Buy The Top Guy",
  description: "The ultimate cryptocurrency token for those who buy the top",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Climate+Crisis&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/images/fav.jpg" />
      </head>
      <body className={inter.className}>
        <ContractAddressProvider>
          {children}
        </ContractAddressProvider>
      </body>
    </html>
  )
}
