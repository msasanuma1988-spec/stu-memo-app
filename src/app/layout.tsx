import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { BookOpen, LogIn, LogOut, User } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "学習メモ共有アプリ",
  description: "学習メモを管理・共有できるアプリ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="ja">
      <body>
        <header className="site-header">
          <Link href="/memos" className="site-title">
            <BookOpen size={20} aria-hidden />
            学習メモ共有アプリ
          </Link>
          {user ? (
            <div className="site-header-auth">
              <span className="site-header-user">
                <User size={15} aria-hidden />
                <span className="site-header-email">{user.email}</span>
              </span>
              <form action={signOut}>
                <button type="submit" className="button">
                  <LogOut size={15} aria-hidden />
                  ログアウト
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="button">
              <LogIn size={15} aria-hidden />
              ログイン
            </Link>
          )}
        </header>
        <main className="site-main">{children}</main>
      </body>
    </html>
  );
}
