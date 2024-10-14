export interface Product {
  id: string;
  title: string;
  amount: number;
  price: number;
  favorite: boolean;
  image?: string;
  albumPhotos?: string[];
}

export interface ShopCart {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  userId: string;
  amount: number;
  product: Product;
}
