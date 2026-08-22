"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseTagNames } from "@/lib/tags";

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

async function syncMemoTags(supabase: SupabaseClient, memoId: string, tagNames: string[]) {
  await supabase.from("memo_tags").delete().eq("memo_id", memoId);

  if (tagNames.length === 0) {
    return;
  }

  const tagIds: number[] = [];

  for (const name of tagNames) {
    const { data: existingTag } = await supabase
      .from("tags")
      .select("id")
      .eq("name", name)
      .maybeSingle();

    if (existingTag) {
      tagIds.push(existingTag.id);
      continue;
    }

    const { data: createdTag, error: createError } = await supabase
      .from("tags")
      .insert({ name })
      .select("id")
      .single();

    if (createError) {
      // 同時に同じ名前のタグが作られていた場合、ここでもう一度探しにいく
      const { data: retryTag } = await supabase.from("tags").select("id").eq("name", name).single();
      if (retryTag) {
        tagIds.push(retryTag.id);
      }
      continue;
    }

    tagIds.push(createdTag.id);
  }

  if (tagIds.length > 0) {
    await supabase.from("memo_tags").insert(tagIds.map((tagId) => ({ memo_id: memoId, tag_id: tagId })));
  }
}

export async function createMemo(formData: FormData) {
  const { supabase, user } = await requireUser();

  const title = (formData.get("title") as string).trim();
  const content = formData.get("content") as string;
  const isPublic = formData.get("isPublic") === "on";
  const tagNames = parseTagNames((formData.get("tags") as string) ?? "");

  const { data: memo, error } = await supabase
    .from("memos")
    .insert({ user_id: user.id, title, content, is_public: isPublic })
    .select("id")
    .single();

  if (error || !memo) {
    throw new Error(`メモの作成に失敗しました: ${error?.message}`);
  }

  await syncMemoTags(supabase, memo.id, tagNames);
  redirect(`/memos/${memo.id}`);
}

export async function updateMemo(memoId: string, formData: FormData) {
  const { supabase, user } = await requireUser();

  const title = (formData.get("title") as string).trim();
  const content = formData.get("content") as string;
  const isPublic = formData.get("isPublic") === "on";
  const tagNames = parseTagNames((formData.get("tags") as string) ?? "");

  const { error } = await supabase
    .from("memos")
    .update({ title, content, is_public: isPublic })
    .eq("id", memoId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`メモの更新に失敗しました: ${error.message}`);
  }

  await syncMemoTags(supabase, memoId, tagNames);
  redirect(`/memos/${memoId}`);
}

export async function toggleMemoVisibility(memoId: string, nextIsPublic: boolean) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("memos")
    .update({ is_public: nextIsPublic })
    .eq("id", memoId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`公開設定の変更に失敗しました: ${error.message}`);
  }

  // 一覧・詳細ページのキャッシュを更新し、画面遷移せずに最新の公開状態を反映する
  revalidatePath("/memos");
  revalidatePath(`/memos/${memoId}`);
}

export async function deleteMemo(memoId: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("memos").delete().eq("id", memoId).eq("user_id", user.id);

  if (error) {
    throw new Error(`メモの削除に失敗しました: ${error.message}`);
  }

  redirect("/memos");
}
