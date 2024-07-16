export interface User {
  username: string;
  id: string;
}

export interface Comment {
  id: string;
  productId: string;
  text: string;
  date: Date;
  user: User;
  comments: Comment[];
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
