import type { SupabaseClient } from "@supabase/supabase-js";
import type { Comment, Memo } from "./types";

const MEMO_SELECT =
  "id, user_id, title, content, is_public, created_at, updated_at, profiles(display_name), memo_tags(tags(name))";

function mapMemoRow(row: any): Memo {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    content: row.content,
    isPublic: row.is_public,
    tagNames: (row.memo_tags ?? [])
      .map((memoTag: any) => memoTag.tags?.name)
      .filter((name: unknown): name is string => Boolean(name)),
    authorName: row.profiles?.display_name ?? "名無しさん",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchMemos(supabase: SupabaseClient): Promise<Memo[]> {
  const { data, error } = await supabase
    .from("memos")
    .select(MEMO_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`メモ一覧の取得に失敗しました: ${error.message}`);
  }

  return (data ?? []).map(mapMemoRow);
}

export async function fetchMemoById(supabase: SupabaseClient, id: string): Promise<Memo | null> {
  const { data, error } = await supabase.from("memos").select(MEMO_SELECT).eq("id", id).maybeSingle();

  if (error) {
    throw new Error(`メモの取得に失敗しました: ${error.message}`);
  }

  return data ? mapMemoRow(data) : null;
}

function mapCommentRow(row: any): Comment {
  return {
    id: row.id,
    memoId: row.memo_id,
    userId: row.user_id,
    authorName: row.profiles?.display_name ?? "名無しさん",
    content: row.content,
    createdAt: row.created_at,
  };
}

export async function fetchCommentsByMemoId(
  supabase: SupabaseClient,
  memoId: string
): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("id, memo_id, user_id, content, created_at, profiles(display_name)")
    .eq("memo_id", memoId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`コメントの取得に失敗しました: ${error.message}`);
  }

  return (data ?? []).map(mapCommentRow);
}
