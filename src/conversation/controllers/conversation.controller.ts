import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { ConversationService } from '../services/conversation.service';
import { UserRequest } from 'src/user/user.decorator';
import { PayloadToken } from 'src/auth/dto/payload-token.dto';
import { FindAllConversationDto } from '../dto/find-all-conversation.dto';
import { CreateMessage } from '../dto/create-message.dto';
import { ShopGuard } from 'src/guards/shop.guard';
import { FindAllMessageDto, UpdateMessage } from '../dto/update-message.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('conversation')
export class ConversationController {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly conversationService: ConversationService,
  ) {}

  @Post('user')
  @UseGuards(AuthGuard)
  async createByUser(
    @Body() createConversationDto: CreateConversationDto,
    @UserRequest() user: PayloadToken,
  ) {
    const conversation = await this.conversationService.create({
      ...createConversationDto,
      id: user.id,
    });
    this.eventEmitter.emit('conversation.user.create', {
      conversation,
      shopId: createConversationDto.shopId,
    });

    return conversation;
  }

  @Post('shop')
  @UseGuards(ShopGuard)
  async createByShop(
    @Body() createConversationDto: CreateConversationDto,
    @UserRequest() user: PayloadToken,
  ) {
    const conversation = await this.conversationService.create({
      ...createConversationDto,
      shopId: user.id,
    });
    this.eventEmitter.emit('conversation.shop.create', {
      conversation,
      shopId: createConversationDto.shopId,
    });
    return conversation;
  }

  @Get('messages-all')
  findAllMessage(@Query() findAllMessageDto: FindAllMessageDto): Promise<any> {
    return this.conversationService.findAllMessage(findAllMessageDto);
  }

  @Get()
  @UseGuards(ShopGuard)
  findAll(
    @Query() findAllConversationDto: FindAllConversationDto,
    @UserRequest() user: PayloadToken,
  ): Promise<any> {
    return this.conversationService.findAllShop({
      ...findAllConversationDto,
      shopId: user.id,
    });
  }

  @Get('user')
  @UseGuards(AuthGuard)
  findAllUser(
    @Query() findAllConversationDto: FindAllConversationDto,
    @UserRequest() user: PayloadToken,
  ): Promise<any> {
    return this.conversationService.findAllUser({
      ...findAllConversationDto,
      id: user.id,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne(id);
  }

  @Get('user/:shopId')
  @UseGuards(AuthGuard)
  findOneByUser(
    @Param('shopId') shopId: string,
    @UserRequest() user: PayloadToken,
  ) {
    return this.conversationService.findOneByUserAndShop(user.id, shopId);
  }

  @Get('shop/:userId')
  @UseGuards(AuthGuard)
  findOneByShop(
    @Param('userId') userId: string,
    @UserRequest() user: PayloadToken,
  ) {
    return this.conversationService.findOneByUserAndShop(userId, user.id);
  }

  @Post('message-shop')
  @UseGuards(ShopGuard)
  async createMessageShop(
    @Body() createMessage: CreateMessage,
    @UserRequest() user: PayloadToken,
  ) {
    const { message, conversation } =
      await this.conversationService.createMessage({
        ...createMessage,
        shop: user,
      });
    this.eventEmitter.emit('message.create', { message, conversation });
    return message;
  }

  @Post('message')
  @UseGuards(AuthGuard)
  async createMessageUser(
    @Body() createMessage: CreateMessage,
    @UserRequest() user: PayloadToken,
  ) {
    const { message, conversation } =
      await this.conversationService.createMessage({
        ...createMessage,
        user: user,
      });
    return this.eventEmitter.emit('message.create', { message, conversation });
  }

  @Post('message-reply/:conver/:id')
  @UseGuards(AuthGuard)
  async createReplyMessageUser(
    @Body() createMessage: CreateMessage,
    @UserRequest() user: PayloadToken,
    @Param('id') messageId: number,
    @Param('conver') conversationId: string,
  ) {
    const { message, conversation } =
      await this.conversationService.createReplyMessage({
        ...createMessage,
        user: user,
        messageId,
        conversationId,
      });
    return this.eventEmitter.emit('message.create', { message, conversation });
  }

  @Post('message-reply-shop/:conver/:id')
  @UseGuards(ShopGuard)
  async createReplyMessageShop(
    @Body() createMessage: CreateMessage,
    @UserRequest() user: PayloadToken,
    @Param('id') messageId: number,
    @Param('conver') conversationId: string,
  ) {
    const { message, conversation } =
      await this.conversationService.createReplyMessage({
        ...createMessage,
        shop: user,
        messageId,
        conversationId,
      });
    return this.eventEmitter.emit('message.create', { message, conversation });
  }

  @Patch('message/:conversationId/:id')
  @UseGuards(AuthGuard)
  async updateMessage(
    @Param('id') id: number,
    @Param('conversationId') conversationId: string,
    @Body()
    updateMessage: UpdateMessage,
  ) {
    const message = await this.conversationService.updateMessage(
      id,
      updateMessage,
    );
    const conversation = await this.conversationService.getConversation(
      conversationId,
    );
    return this.eventEmitter.emit('message.update', {
      message,
      conversation,
    });
  }

  @Patch('message-shop/:conversationId/:id')
  @UseGuards(ShopGuard)
  async updateMessageShop(
    @Param('id') id: number,
    @Param('conversationId') conversationId: string,
    @Body()
    updateMessage: UpdateMessage,
  ) {
    const message = await this.conversationService.updateMessage(
      id,
      updateMessage,
    );
    const conversation = await this.conversationService.getConversation(
      conversationId,
    );
    return this.eventEmitter.emit('message.update', {
      message,
      conversation,
    });
  }

  @Delete('message/:conversationId/:id')
  @UseGuards(AuthGuard)
  async deleteMessage(
    @Param('id') id: number,
    @Param('conversationId') conversationId: string,
    @UserRequest() user: PayloadToken,
  ) {
    const message = await this.conversationService.deleteMessage({
      id,
      userId: user.id,
    });
    const conversation = await this.conversationService.getConversation(
      conversationId,
    );
    return this.eventEmitter.emit('message.delete', {
      message,
      conversation,
    });
  }

  @Delete('message-shop/:conversationId/:id')
  @UseGuards(ShopGuard)
  async deleteMessageShop(
    @Param('id') id: number,
    @Param('conversationId') conversationId: string,
    @UserRequest() user: PayloadToken,
  ) {
    const message = await this.conversationService.deleteMessage({
      id,
      shopId: user.id,
    });
    const conversation = await this.conversationService.getConversation(
      conversationId,
    );
    return this.eventEmitter.emit('message.delete', {
      message,
      conversation,
    });
  }
}
