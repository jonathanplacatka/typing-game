import type { Metadata } from "next";
import { Inter } from "next/font/google";

import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core'

import "./globals.css";

import Header from "./components/PageLayout/Header";

import "./globals.css";
import { Notifications } from "@mantine/notifications";
import '@mantine/notifications/styles.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark"/>
      </head>

      <body className={inter.className}>
        <MantineProvider defaultColorScheme="dark">
          <Header />
          <Notifications position="bottom-right" zIndex={1000} containerWidth={440} limit={5}/>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
