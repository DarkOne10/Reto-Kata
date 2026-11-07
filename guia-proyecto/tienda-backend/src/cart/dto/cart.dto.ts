import { IsNumber, IsPositive } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @IsPositive()
  quantity: number;
}
