import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { MessagesService } from './messages.service.js';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Guarda un texto de prueba' })
  @ApiBody({ type: CreateMessageDto })
  create(@Body() body: CreateMessageDto) {
    const content = typeof body?.content === 'string' ? body.content.trim() : '';

    if (!content) {
      throw new BadRequestException('El texto es obligatorio.');
    }

    if (content.length > 500) {
      throw new BadRequestException('El texto no puede superar 500 caracteres.');
    }

    return this.messagesService.create(content);
  }

  @Get('latest')
  @ApiOperation({ summary: 'Consulta el último texto guardado' })
  latest() {
    return this.messagesService.latest();
  }
}