import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user/current-user.decorator';

import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  // ==========================
  // Start Conversation
  // ==========================
  @Post('conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createConversation(
    @CurrentUser() user: any,
    @Body() dto: CreateConversationDto,
  ) {
    return this.chatService.createConversation(
      dto.propertyId,
      user.id,
    );
  }

  // ==========================
  // Send Message
  // ==========================
  @Post('conversations/:conversationId/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  sendMessage(
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: any,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(
      conversationId,
      user.id,
      dto.text,
    );
  }

  // ==========================
// Conversation List
// ==========================
@Get('conversations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
listConversations(
  @CurrentUser() user: any,
) {
  return this.chatService.listConversations(
    user.id,
  );
}

// ==========================
// Mark Message Read
// ==========================
@Patch('messages/:messageId/read')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
markAsRead(
  @Param('messageId') messageId: string,
  @CurrentUser() user: any,
) {
  return this.chatService.markAsRead(
    messageId,
    user.id,
  );
}

  // ==========================
  // Get Messages
  // ==========================
  @Get('conversations/:conversationId/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMessages(
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: any,
  ) {
    return this.chatService.getMessages(
      conversationId,
      user.id,
    );
  }
}