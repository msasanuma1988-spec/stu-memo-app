"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleMemoVisibility } from "@/lib/actions/memos";

export function VisibilityToggleButton({
  memoId,
  isPublic,
}: {
  memoId: string;
  isPublic: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await toggleMemoVisibility(memoId, !isPublic);
      router.refresh();
    });
  }

  return (
    <button type="button" className="button" onClick={handleClick} disabled={isPending}>
      {isPending ? "切り替え中..." : isPublic ? "非公開にする" : "公開にする"}
    </button>
  );
}
