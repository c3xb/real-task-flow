import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Flow - Task Management",
  description: "A sleek task management application with RTL and multilingual support",
};

const themeAndLocaleInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = theme === 'dark' || (!theme && systemPrefersDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    var locale = localStorage.getItem('task-flow-locale') || localStorage.getItem('locale');
    var validLocales = ['en', 'ar', 'fr', 'es', 'tr'];
    if (locale && validLocales.indexOf(locale) !== -1) {
      document.documentElement.setAttribute('lang', locale);
      document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      dir="ltr" 
      suppressHydrationWarning 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <Script
          id="theme-locale-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeAndLocaleInitScript }}
        />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}