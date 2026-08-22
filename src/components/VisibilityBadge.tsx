import { Globe, Lock } from "lucide-react";

export function VisibilityBadge({ isPublic }: { isPublic: boolean }) {
  return (
    <span className={`badge ${isPublic ? "badge-public" : "badge-private"}`}>
      {isPublic ? <Globe size={13} strokeWidth={2.25} aria-hidden /> : <Lock size={13} strokeWidth={2.25} aria-hidden />}
      {isPublic ? "公開" : "非公開"}
    </span>
  );
}
