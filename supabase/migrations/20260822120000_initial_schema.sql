-- 学習メモ共有アプリ 初期スキーマ
-- 計画書.md「4. データ構造（テーブル設計）」の内容をそのままSQL化したものです。

-- =========================================
-- 1. profiles（ユーザーのプロフィール）
-- =========================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 新規ユーザー登録時に、profilesの行を自動作成する
-- (auth.usersはSupabaseのAuth機能が管理する特別なテーブルのため、
--  そこへのINSERTをきっかけに、通常のテーブル操作権限を超えてprofilesへ書き込む必要がある)
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================
-- 2. memos（メモ本体）
-- =========================================
create table public.memos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  content text not null default '',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index memos_user_id_idx on public.memos (user_id);
create index memos_is_public_idx on public.memos (is_public);

alter table public.memos enable row level security;

-- updated_atを更新のたびに自動で現在時刻にする
create function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger memos_set_updated_at
  before update on public.memos
  for each row execute procedure public.set_updated_at();

-- =========================================
-- 3. tags（タグのマスタ）
-- =========================================
create table public.tags (
  id bigint generated always as identity primary key,
  name text not null unique
);

alter table public.tags enable row level security;

-- =========================================
-- 4. memo_tags（メモとタグの中間テーブル）
-- =========================================
create table public.memo_tags (
  memo_id uuid not null references public.memos (id) on delete cascade,
  tag_id bigint not null references public.tags (id) on delete cascade,
  primary key (memo_id, tag_id)
);

create index memo_tags_tag_id_idx on public.memo_tags (tag_id);

alter table public.memo_tags enable row level security;

-- =========================================
-- 5. comments（公開メモへのコメント）
-- =========================================
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  memo_id uuid not null references public.memos (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index comments_memo_id_idx on public.comments (memo_id);
create index comments_user_id_idx on public.comments (user_id);

alter table public.comments enable row level security;

-- =========================================
-- RLSポリシー: profiles
-- 計画書4章「公開・非公開を安全に守る仕組み」の表のとおり
-- 読み取り: 誰でも見られる / 書き込み: 本人のプロフィールのみ更新できる
-- =========================================
create policy "profiles_select_all" on public.profiles
  for select
  to anon, authenticated
  using (true);

create policy "profiles_update_own" on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- =========================================
-- RLSポリシー: memos
-- 読み取り: 公開メモは誰でも／非公開メモは本人のみ
-- 書き込み: 本人のメモのみ、作成・編集・削除できる
-- =========================================
create policy "memos_select_public" on public.memos
  for select
  to anon, authenticated
  using (is_public = true);

create policy "memos_select_own" on public.memos
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "memos_insert_own" on public.memos
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "memos_update_own" on public.memos
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "memos_delete_own" on public.memos
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- =========================================
-- RLSポリシー: tags
-- 読み取り: 誰でも見られる / 書き込み: ログイン済みなら追加できる
-- =========================================
create policy "tags_select_all" on public.tags
  for select
  to anon, authenticated
  using (true);

create policy "tags_insert_authenticated" on public.tags
  for insert
  to authenticated
  with check (true);

-- =========================================
-- RLSポリシー: memo_tags
-- 計画書の表には明記されていないが、memosと同じ考え方で統一する
-- 読み取り: 対象メモを読める人（公開メモ or 自分のメモ）
-- 書き込み: 自分のメモに対してのみタグを付け外しできる
-- =========================================
create policy "memo_tags_select" on public.memo_tags
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.memos m
      where m.id = memo_tags.memo_id
        and (m.is_public = true or m.user_id = (select auth.uid()))
    )
  );

create policy "memo_tags_insert_own_memo" on public.memo_tags
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.memos m
      where m.id = memo_tags.memo_id
        and m.user_id = (select auth.uid())
    )
  );

create policy "memo_tags_delete_own_memo" on public.memo_tags
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.memos m
      where m.id = memo_tags.memo_id
        and m.user_id = (select auth.uid())
    )
  );

-- =========================================
-- RLSポリシー: comments
-- 読み取り: 対象メモが公開、または自分のメモの場合のみ
-- 書き込み: ログイン済みかつ対象メモが公開の場合のみ投稿可。編集・削除は自分のコメントのみ
-- =========================================
create policy "comments_select" on public.comments
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.memos m
      where m.id = comments.memo_id
        and (m.is_public = true or m.user_id = (select auth.uid()))
    )
  );

create policy "comments_insert" on public.comments
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.memos m
      where m.id = comments.memo_id
        and m.is_public = true
    )
  );

create policy "comments_update_own" on public.comments
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "comments_delete_own" on public.comments
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
