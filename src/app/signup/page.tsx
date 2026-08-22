import Link from "next/link";
import { UserPlus } from "lucide-react";
import { signUp } from "@/lib/actions/auth";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <div className="page-header">
        <h1>アカウント作成</h1>
      </div>

      <form className="memo-form" action={signUp}>
        {error && <p className="form-error">{error}</p>}

        <div className="form-field">
          <label htmlFor="displayName">表示名</label>
          <input id="displayName" name="displayName" type="text" placeholder="例: 笹沼" required />
        </div>

        <div className="form-field">
          <label htmlFor="email">メールアドレス</label>
          <input id="email" name="email" type="email" required />
        </div>

        <div className="form-field">
          <label htmlFor="password">パスワード（6文字以上）</label>
          <input id="password" name="password" type="password" required minLength={6} />
        </div>

        <button type="submit" className="button button-primary">
          <UserPlus size={16} aria-hidden />
          アカウント作成
        </button>
      </form>

      <p className="auth-footnote">
        すでにアカウントをお持ちの方は <Link href="/login">こちらからログイン</Link>
      </p>
    </div>
  );
}
