export interface User {
  username: string;
  id: string;
}

export interface CommentType {
  id: string;
  productId: string;
  text: string;
  date: Date;
  userId: string;
  parentCommentId: string | null;
}

export interface Product {
  id: string;
  title: string;
  amount: number;
  price: number;
  favorite: boolean;
  image?: string;
  albumPhotos?: string[];
  comments: Comment[];
}
