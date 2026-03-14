import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Домакино — Онлайн Кинотеатр",
  description: "Смотрите лучшие фильмы и сериалы онлайн вместе с друзьями. Домакино — кино дома, вместе.",
  keywords: ["Домакино", "онлайн кинотеатр", "фильмы онлайн", "сериалы", "смотреть фильмы", "кино"],
  authors: [{ name: "Домакино" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎬</text></svg>",
  },
  openGraph: {
    title: "Домакино — Онлайн Кинотеатр",
    description: "Смотрите лучшие фильмы и сериалы онлайн вместе с друзьями",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Домакино — Онлайн Кинотеатр",
    description: "Смотрите лучшие фильмы и сериалы онлайн вместе с друзьями",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning className="dark">
      <body className="antialiased bg-[#07080F] text-white min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
