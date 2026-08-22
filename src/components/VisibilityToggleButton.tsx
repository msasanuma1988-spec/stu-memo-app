"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Globe, Lock } from "lucide-react";
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
      {isPublic ? <Lock size={15} aria-hidden /> : <Globe size={15} aria-hidden />}
      {isPending ? "切り替え中..." : isPublic ? "非公開にする" : "公開にする"}
    </button>
  );
}
