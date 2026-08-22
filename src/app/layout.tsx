import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "学習メモ共有アプリ",
  description: "学習メモを管理・共有できるアプリ",
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
            学習メモ共有アプリ
          </Link>
          {user ? (
            <div className="site-header-auth">
              <span>{user.email}</span>
              <form action={signOut}>
                <button type="submit" className="button">
                  ログアウト
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="button">
              ログイン
            </Link>
          )}
        </header>
        <main className="site-main">{children}</main>
      </body>
    </html>
  );
}
