import type { Metadata } from "next";
import { Inter, Old_Standard_TT } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const oldStandardTt = Old_Standard_TT({
  subsets: ["latin", "cyrillic"],
  variable: "--font-old-standard",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Люди едут к людям",
  description:
    "Платформа культурных поездок и волонтёрского туризма по России.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${oldStandardTt.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased bg-[#efeae2] text-[#111111]">
        {children}
      </body>
    </html>
  );
}
