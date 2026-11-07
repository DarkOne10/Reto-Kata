import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@User('userId') userId: number) {
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  findOne(@User('userId') userId: number, @Param('id') id: string) {
    return this.ordersService.findOne(userId, +id);
  }
}
