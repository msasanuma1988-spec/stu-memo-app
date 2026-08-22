import { Tag } from "lucide-react";

export function TagBadge({ name }: { name: string }) {
  return (
    <span className="badge badge-tag">
      <Tag size={12} strokeWidth={2.25} aria-hidden />
      {name}
    </span>
  );
}
