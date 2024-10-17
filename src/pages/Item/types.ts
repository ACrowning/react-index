export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  money: number;
  token: string;
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
