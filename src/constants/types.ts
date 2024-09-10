export interface Product {
  id: string;
  title: string;
  amount: number;
  price: number;
  favorite: boolean;
  image?: string;
  albumPhotos?: string[];
}

export interface CartItem {
  cartItemId: string;
  userId: string;
  amount: number;
  product: Product;
}

export interface ShopCart {
  cartId: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
