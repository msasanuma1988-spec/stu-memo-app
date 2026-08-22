"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

// 投稿: ログイン済み、かつ対象メモが公開の場合のみ挿入できる
// (RLSのcomments_insertポリシーが最終的な砦。ここでの認証チェックは、
//  未ログインのままフォームを送った人に分かりやすくログインを促すためのもの)
export async function createComment(memoId: string, formData: FormData) {
  const { supabase, user } = await requireUser();
  const content = (formData.get("content") as string).trim();

  if (!content) {
    return;
  }

  const { error } = await supabase.from("comments").insert({
    memo_id: memoId,
    user_id: user.id,
    content,
  });

  if (error) {
    throw new Error(`コメントの投稿に失敗しました: ${error.message}`);
  }

  revalidatePath(`/memos/${memoId}`);
}

// 編集: 自分のコメントのみ (user_idの一致をここでも明示)
export async function updateComment(commentId: string, memoId: string, content: string) {
  const { supabase, user } = await requireUser();
  const trimmed = content.trim();

  if (!trimmed) {
    return;
  }

  const { error } = await supabase
    .from("comments")
    .update({ content: trimmed })
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`コメントの更新に失敗しました: ${error.message}`);
  }

  revalidatePath(`/memos/${memoId}`);
}

// 削除: 自分のコメントのみ
export async function deleteComment(commentId: string, memoId: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("comments").delete().eq("id", commentId).eq("user_id", user.id);

  if (error) {
    throw new Error(`コメントの削除に失敗しました: ${error.message}`);
  }

  revalidatePath(`/memos/${memoId}`);
}
