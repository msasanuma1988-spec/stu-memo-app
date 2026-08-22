import { createComment } from "@/lib/actions/comments";

export function CommentForm({ memoId }: { memoId: string }) {
  const createCommentWithMemoId = createComment.bind(null, memoId);

  return (
    <form className="comment-form" action={createCommentWithMemoId}>
      <textarea name="content" placeholder="コメントを書く" rows={3} required />
      <button type="submit" className="button button-primary">
        コメントを投稿する
      </button>
    </form>
  );
}
