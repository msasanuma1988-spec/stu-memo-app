"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { deleteComment, updateComment } from "@/lib/actions/comments";
import { formatDateTime } from "@/lib/format";
import type { Comment } from "@/lib/types";

export function CommentItem({
  comment,
  memoId,
  isOwner,
}: {
  comment: Comment;
  memoId: string;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const content = draft.trim();
    if (!content) {
      return;
    }
    startTransition(async () => {
      await updateComment(comment.id, memoId, content);
      setIsEditing(false);
      router.refresh();
    });
  }

  function handleCancel() {
    setDraft(comment.content);
    setIsEditing(false);
  }

  function handleDelete() {
    if (!confirm("このコメントを削除します。よろしいですか？")) {
      return;
    }
    startTransition(async () => {
      await deleteComment(comment.id, memoId);
      router.refresh();
    });
  }

  return (
    <li className="comment-item">
      <div className="comment-meta">
        <span className="comment-author">{comment.authorName}</span>
        <span className="comment-date">{formatDateTime(comment.createdAt)}</span>
      </div>

      {isEditing ? (
        <div className="comment-edit-form">
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={3} />
          <div className="comment-edit-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={handleSave}
              disabled={isPending}
            >
              <Check size={15} aria-hidden />
              保存する
            </button>
            <button type="button" className="button" onClick={handleCancel} disabled={isPending}>
              <X size={15} aria-hidden />
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="comment-content">{comment.content}</p>
          {isOwner && (
            <div className="comment-actions">
              <button type="button" className="button-link" onClick={() => setIsEditing(true)}>
                <Pencil size={13} aria-hidden />
                編集
              </button>
              <button type="button" className="button-link" onClick={handleDelete} disabled={isPending}>
                <Trash2 size={13} aria-hidden />
                削除
              </button>
            </div>
          )}
        </>
      )}
    </li>
  );
}
