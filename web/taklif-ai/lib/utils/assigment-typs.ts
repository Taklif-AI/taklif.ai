export interface Assignment {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  likes: number;
  dislikes: number;
}

export interface AssignmentAction {
  type: 'like' | 'dislike' | 'regenerate' | 'simplify';
  assignmentId: string;
}