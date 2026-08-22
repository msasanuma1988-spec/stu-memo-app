import type { Comment } from "@/lib/types";
import { CommentItem } from "./CommentItem";

export function CommentList({
  comments,
  memoId,
  currentUserId,
}: {
  comments: Comment[];
  memoId: string;
  currentUserId?: string;
}) {
  if (comments.length === 0) {
    return <p className="empty-text">まだコメントはありません。</p>;
  }

  return (
    <ul className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          memoId={memoId}
          isOwner={comment.userId === currentUserId}
        />
      ))}
    </ul>
  );
}
