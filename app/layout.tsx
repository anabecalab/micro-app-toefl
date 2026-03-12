import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "BecaLab - Guía TOEFL 2026 | Nueva Versión",
    description:
        "Descarga la guía completa del nuevo TOEFL 2026. Sprint de 90 minutos, formato adaptativo, escala CEFR 1-6. Todo lo que necesitas saber para prepararte.",
}

export const viewport: Viewport = {
    themeColor: "#312C8E",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es" className="dark">
            <body className="font-sans antialiased" suppressHydrationWarning>
                {children}
            </body>
        </html>
    )
}
