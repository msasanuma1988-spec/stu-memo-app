import Link from "next/link";
import { LogIn } from "lucide-react";
import { signIn } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <div className="page-header">
        <h1>ログイン</h1>
      </div>

      <form className="memo-form" action={signIn}>
        {error && <p className="form-error">{error}</p>}

        <div className="form-field">
          <label htmlFor="email">メールアドレス</label>
          <input id="email" name="email" type="email" required />
        </div>

        <div className="form-field">
          <label htmlFor="password">パスワード</label>
          <input id="password" name="password" type="password" required minLength={6} />
        </div>

        <button type="submit" className="button button-primary">
          <LogIn size={16} aria-hidden />
          ログイン
        </button>
      </form>

      <p className="auth-footnote">
        アカウントをお持ちでない方は <Link href="/signup">こちらから登録</Link>
      </p>
    </div>
  );
}
