import { Save, Tag } from "lucide-react";
import type { Memo } from "@/lib/types";

export function MemoForm({
  initialMemo,
  submitLabel,
  action,
}: {
  initialMemo?: Memo;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form className="memo-form" action={action}>
      <div className="form-field">
        <label htmlFor="title">タイトル</label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={initialMemo?.title}
          placeholder="例: 二次関数の頂点の求め方"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="content">本文</label>
        <textarea
          id="content"
          name="content"
          defaultValue={initialMemo?.content}
          placeholder="メモの内容を書いてください"
          rows={10}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="tags">
          <Tag size={13} aria-hidden />
          タグ（カンマ区切りで複数入力できます）
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={initialMemo?.tagNames.join(", ")}
          placeholder="例: 数学, テスト対策"
        />
      </div>

      <div className="form-field form-field-checkbox">
        <label htmlFor="isPublic">
          <input id="isPublic" name="isPublic" type="checkbox" defaultChecked={initialMemo?.isPublic} />
          このメモを公開する
        </label>
        <p className="form-hint">
          公開すると、他のユーザーがこのメモを見たりコメントを書き込んだりできるようになります。
        </p>
      </div>

      <button type="submit" className="button button-primary">
        <Save size={16} aria-hidden />
        {submitLabel}
      </button>
    </form>
  );
}
