import type { Metadata } from "next";
import { Inter } from "next/font/google";



import '@mantine/core/styles.css';
import { Button, ColorSchemeScript, MantineProvider } from '@mantine/core'
import "./globals.css";

import Header from "./components/PageLayout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript/>
      </head>

      <body className={inter.className}>
        <MantineProvider defaultColorScheme="dark">
          <Header />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
