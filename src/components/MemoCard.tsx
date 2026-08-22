import Link from "next/link";
import type { Memo } from "@/lib/types";
import { TagBadge } from "./TagBadge";
import { VisibilityBadge } from "./VisibilityBadge";

export function MemoCard({ memo }: { memo: Memo }) {
  return (
    <Link href={`/memos/${memo.id}`} className="memo-card">
      <div className="memo-card-header">
        <h3 className="memo-card-title">{memo.title}</h3>
        <VisibilityBadge isPublic={memo.isPublic} />
      </div>
      <p className="memo-card-excerpt">{memo.content}</p>
      {memo.tagNames.length > 0 && (
        <div className="memo-card-tags">
          {memo.tagNames.map((tag) => (
            <TagBadge key={tag} name={tag} />
          ))}
        </div>
      )}
    </Link>
  );
}
