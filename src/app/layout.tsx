import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clã Michetti - Loja Mística",
  description: "Loja online para bruxos, com tema místico e moderno.",
};

function MysticBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-emerald-700 opacity-90" />
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-purple-400 blur-3xl opacity-30 rounded-full animate-pulse" />
      <div className="absolute right-1/4 bottom-1/4 w-80 h-80 bg-indigo-500 blur-2xl opacity-20 rounded-full animate-pulse" />
      <div className="absolute left-1/2 top-2/3 w-72 h-72 bg-emerald-400 blur-2xl opacity-20 rounded-full animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-transparent via-indigo-400/10 to-transparent" />
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative`}
      >
        <MysticBackground />
        <header className="w-full py-6 px-4 flex justify-center items-center gap-4">
          <span className="text-3xl font-extrabold text-purple-300 drop-shadow-lg tracking-widest select-none glow">
            🔮 Clã Michetti
          </span>
        </header>
        <main className="relative z-10">{children}</main>
        <footer className="w-full text-center py-4 text-indigo-200 text-xs opacity-80">
          &copy; {new Date().getFullYear()} Clã Michetti. Feito com magia e
          Next.js.
        </footer>
      </body>
    </html>
  );
}
