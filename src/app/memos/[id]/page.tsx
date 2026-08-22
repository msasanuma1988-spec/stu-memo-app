import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchCommentsByMemoId, fetchMemoById } from "@/lib/memos";
import { formatDateTime } from "@/lib/format";
import { TagBadge } from "@/components/TagBadge";
import { VisibilityBadge } from "@/components/VisibilityBadge";
import { CommentList } from "@/components/CommentList";
import { CommentForm } from "@/components/CommentForm";
import { DeleteMemoButton } from "@/components/DeleteMemoButton";
import { VisibilityToggleButton } from "@/components/VisibilityToggleButton";

export default async function MemoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    {
      data: { user },
    },
    memo,
  ] = await Promise.all([supabase.auth.getUser(), fetchMemoById(supabase, id)]);

  if (!memo) {
    notFound();
  }

  const comments = memo.isPublic ? await fetchCommentsByMemoId(supabase, memo.id) : [];
  const isOwner = user?.id === memo.userId;

  return (
    <div>
      <p>
        <Link href="/memos">← メモ一覧に戻る</Link>
      </p>

      <div className="memo-detail-header">
        <h1>{memo.title}</h1>
        <VisibilityBadge isPublic={memo.isPublic} />
      </div>

      <p className="memo-detail-meta">
        {memo.authorName} ・ 更新日時: {formatDateTime(memo.updatedAt)}
      </p>

      {memo.tagNames.length > 0 && (
        <div className="memo-detail-tags">
          {memo.tagNames.map((tag) => (
            <TagBadge key={tag} name={tag} />
          ))}
        </div>
      )}

      <p className="memo-detail-content">{memo.content}</p>

      {isOwner && (
        <div className="memo-detail-actions">
          <Link href={`/memos/${memo.id}/edit`} className="button">
            このメモを編集する
          </Link>
          <VisibilityToggleButton memoId={memo.id} isPublic={memo.isPublic} />
          <DeleteMemoButton memoId={memo.id} />
        </div>
      )}

      {memo.isPublic && (
        <section className="comment-section">
          <h2>コメント（{comments.length}件）</h2>
          <CommentList comments={comments} memoId={memo.id} currentUserId={user?.id} />
          {user ? (
            <CommentForm memoId={memo.id} />
          ) : (
            <p className="empty-text">
              コメントを書くには <Link href="/login">ログイン</Link> してください。
            </p>
          )}
        </section>
      )}
    </div>
  );
}
