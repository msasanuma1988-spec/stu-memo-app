import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchMemoById } from "@/lib/memos";
import { updateMemo } from "@/lib/actions/memos";
import { MemoForm } from "@/components/MemoForm";

export default async function EditMemoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const memo = await fetchMemoById(supabase, id);

  if (!memo) {
    notFound();
  }

  if (memo.userId !== user.id) {
    redirect(`/memos/${id}`);
  }

  const updateMemoWithId = updateMemo.bind(null, id);

  return (
    <div>
      <div className="page-header">
        <h1>メモを編集</h1>
      </div>
      <MemoForm initialMemo={memo} submitLabel="更新する" action={updateMemoWithId} />
    </div>
  );
}
