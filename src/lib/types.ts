export type Memo = {
  id: string;
  userId: string;
  title: string;
  content: string;
  isPublic: boolean;
  tagNames: string[];
  authorName: string;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  memoId: string;
  userId: string;
  authorName: string;
  content: string;
  createdAt: string;
};
