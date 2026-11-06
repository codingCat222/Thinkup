import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy December – Best Kids' Apps Challenge | ThinkUp Innovation Services",
  description:
    "Kids pitch their app ideas and compete for prizes in a fun, creative and exciting event on Saturday, Dec 12, 2026 at ThinkUp Innovation Hub, Ibadan. Register your child now!",
  keywords: [
    "ThinkUp Innovation Services",
    "Best Kids Apps Challenge",
    "Kids coding competition Ibadan",
    "Kids app challenge Nigeria",
    "ThinkUp Innovation Hub",
    "Happy December kids tech",
  ],
  authors: [{ name: "ThinkUp Innovation Services" }],
  openGraph: {
    title: "Happy December – Best Kids' Apps Challenge | ThinkUp Innovation Services",
    description:
      "Kids pitch their app ideas and compete for prizes in a fun, creative, and exciting event at ThinkUp Innovation Hub, Ibadan.",
    url: "https://thinkupinnovations.com",
    siteName: "ThinkUp Innovation Services",
    images: [
      {
        url: "/images/flyer.jpg",
        width: 1200,
        height: 630,
        alt: "Happy December Best Kids' Apps Challenge",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-white text-slate-900 selection:bg-rose-100 selection:text-rose-900">
        {children}
      </body>
    </html>
  );
}
