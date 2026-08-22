import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { fetchMemos } from "@/lib/memos";
import { MemoCard } from "@/components/MemoCard";

export default async function MemoListPage() {
  const supabase = await createClient();
  const memos = await fetchMemos(supabase);

  return (
    <div>
      <div className="page-header">
        <h1>メモ一覧</h1>
        <Link href="/memos/new" className="button button-primary">
          + 新規作成
        </Link>
      </div>

      {memos.length === 0 ? (
        <p className="empty-text">まだメモがありません。</p>
      ) : (
        <ul className="memo-list">
          {memos.map((memo) => (
            <li key={memo.id}>
              <MemoCard memo={memo} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
