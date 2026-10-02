import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SITE } from "@/lib/content";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Botlane Studios designs and builds ultra-premium websites from Sheridan, WY. Brand, strategy, design, AI systems, SEO, and development.",
  metadataBase: new URL("https://botlane.studio"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className={`${figtree.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("botstudio-theme");var m=document.cookie.match(/(?:^|; )botstudio-theme=(light|dark)/);document.documentElement.dataset.theme=(m&&m[1]==="dark")?"dark":"light";}catch(e){}})();`,
          }}
        />
        <SmoothScroll />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
