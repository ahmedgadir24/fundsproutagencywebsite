import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fundsprout Grant Database | Find Grants That Fit",
  description:
    "Access our curated grant database updated monthly. Search by geography, grant type, and more. $199 for lifetime access.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Fundsprout Grant Database",
    description: "Find grants that fit your organization. Lifetime access for $199.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
