"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteMemo } from "@/lib/actions/memos";

export function DeleteMemoButton({ memoId }: { memoId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("このメモを削除します。よろしいですか？")) {
      return;
    }
    startTransition(() => {
      deleteMemo(memoId);
    });
  }

  return (
    <button type="button" className="button button-danger" onClick={handleClick} disabled={isPending}>
      <Trash2 size={15} aria-hidden />
      {isPending ? "削除中..." : "このメモを削除する"}
    </button>
  );
}
