import "../lib/styles/global.css";
import LocalFont from "next/font/local";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "ipsum.fun",
    template: "%s | ipsum.fun",
  },
  description: "Co-founder of unkey.dev and founder of planetfall.io",
  openGraph: {
    title: "ipsum.fun",
    description: "Co-founder of unkey.dev and founder of planetfall.io",
    url: "https://ipsum.fun",
    siteName: "ipsum.fun",
    images: [
      {
        url: "https://ipsum.fun/og.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "ipsum.fun",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/favicon.png",
  },
};

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

const anton = LocalFont({
  src: "../public/fonts/Anton-Regular.ttf",
  variable: "--font-anton",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[calSans.variable, anton.variable].join(" ")}>
      <body
        className={`bg-black ${
          process.env.NODE_ENV === "development" ? "debug-screens" : undefined
        }`}
      >
        {children}
      </body>
    </html>
  );
}
