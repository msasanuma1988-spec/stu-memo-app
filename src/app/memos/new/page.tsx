import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createMemo } from "@/lib/actions/memos";
import { MemoForm } from "@/components/MemoForm";

export default async function NewMemoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <div className="page-header">
        <h1>新規メモ作成</h1>
      </div>
      <MemoForm submitLabel="作成する" action={createMemo} />
    </div>
  );
}
