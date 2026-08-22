export function VisibilityBadge({ isPublic }: { isPublic: boolean }) {
  return (
    <span className={`badge ${isPublic ? "badge-public" : "badge-private"}`}>
      {isPublic ? "公開" : "非公開"}
    </span>
  );
}
