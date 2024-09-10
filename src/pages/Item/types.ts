export interface User {
  username: string;
  id: string;
}

export interface CommentType {
  parentId: string | null;
  id: string;
  productId: string;
  text: string;
  date: Date;
  user: User;
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
