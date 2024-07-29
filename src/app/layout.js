import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "The Ice Breaker App",
  description:
    "The Ice Breaker App is a collection of fun and engaging icebreakers for teams.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-EJZLFLT5BX" />

      <body className={inter.className}>{children}</body>
    </html>
  );
}
