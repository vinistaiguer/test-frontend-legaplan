import type { Metadata } from "next";
import React from 'react';
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Frontend Legaplan",
  description: "Todo List",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
