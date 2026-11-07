export class OrderDto {
  id: number;
  userId: number;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemDto[];
}

export class OrderItemDto {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product?: {
    name: string;
    image?: string;
  };
}
