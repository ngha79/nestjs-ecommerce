import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from 'src/entities/conversation.entity';
import { Like, Repository } from 'typeorm';
import { MessageConversation } from 'src/entities/message.entity';
import { ImageMessage } from 'src/entities/image-message.entity';
import { FindAllConversationDto } from '../dto/find-all-conversation.dto';
import { CreateMessage } from '../dto/create-message.dto';
import { FindAllMessageDto, UpdateMessage } from '../dto/update-message.dto';
import { CreateReplyDto } from '../dto/create-reply-message.dto';
import { ReplyMessage } from 'src/entities/reply_message.entity';

interface PaginationData {
  data?: any[];
  lastPage: number;
  prevPage: number | null;
  nextPage: number | null;
}

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(MessageConversation)
    private readonly messageRepo: Repository<MessageConversation>,
    @InjectRepository(ImageMessage)
    private readonly imageMessageRepo: Repository<ImageMessage>,
    @InjectRepository(ReplyMessage)
    private readonly replyMessageRepo: Repository<ReplyMessage>,
  ) {}

  async create(createConversationDto: CreateConversationDto) {
    const checkConversationIsExist = await this.findOneByUser(
      createConversationDto,
    );
    if (checkConversationIsExist) return checkConversationIsExist;
    return await this.conversationRepo.save({
      user: { id: createConversationDto.id },
      shop: { id: createConversationDto.shopId },
    });
  }

  async findAllShop(findAllConversationDto: FindAllConversationDto) {
    const page = +findAllConversationDto.page;
    const limit = +findAllConversationDto.limit;
    const skip = limit * (page - 1);
    const { shopId, search } = findAllConversationDto;

    const [res, total] = await this.conversationRepo.findAndCount({
      where: {
        user: {
          userName: Like(`%${search}%`),
        },
        shop: { id: shopId },
      },
      relations: ['user', 'shop'],
      select: {
        user: {
          userName: true,
          avatar: true,
          id: true,
        },
        shop: {
          userName: true,
          avatar: true,
          id: true,
        },
      },
      take: limit,
      skip: skip,
    });

    for (const conversation of res) {
      const latestMessage = await this.messageRepo.findOne({
        where: { conversation: { id: conversation.id } },
        order: { createdAt: 'DESC' },
        relations: ['images'],
      });
      conversation['latestMessage'] = latestMessage;
    }

    const lastPage = Math.ceil(total / limit);

    let prevPage: number | null = null;
    if (page > 1) {
      prevPage = page - 1;
    }

    let nextPage: number | null = null;
    if (page < lastPage) {
      nextPage = page + 1;
    }

    // get first page message in each conversation
    const newConversation = await Promise.all(
      res.map(async (conver) => {
        const messages = await this.findAllMessage({
          page: 1,
          limit: 20,
          conversationId: conver.id,
        });
        conver.messages = messages.data;
        return conver;
      }),
    );

    const paginationData: PaginationData = {
      data: newConversation,
      lastPage,
      prevPage,
      nextPage,
    };

    return paginationData;
  }

  async findAllUser(findAllConversationDto: FindAllConversationDto) {
    const page = +findAllConversationDto.page;
    const limit = +findAllConversationDto.limit;
    const skip = limit * (page - 1);
    const { id, search } = findAllConversationDto;
    const [res, total] = await this.conversationRepo.findAndCount({
      where: {
        shop: {
          userName: Like(`%${search}%`),
        },
        user: { id: id },
      },
      relations: ['user', 'shop'],
      select: {
        user: {
          userName: true,
          avatar: true,
          id: true,
        },
        shop: {
          userName: true,
          avatar: true,
          id: true,
        },
      },
      take: limit,
      skip: skip,
    });
    for (const conversation of res) {
      const latestMessage = await this.messageRepo.findOne({
        where: { conversation: { id: conversation.id } },
        order: { createdAt: 'DESC' },
        relations: ['images'],
      });
      conversation['latestMessage'] = latestMessage;
    }

    const lastPage = Math.ceil(total / limit);

    let prevPage: number | null = null;
    if (page > 1) {
      prevPage = page - 1;
    }

    let nextPage: number | null = null;
    if (page < lastPage) {
      nextPage = page + 1;
    }

    // get first page message in each conversation

    const newConversation = await Promise.all(
      res.map(async (conver) => {
        const messages = await this.findAllMessage({
          page: 1,
          limit: 20,
          conversationId: conver.id,
        });
        conver.messages = messages.data;
        conver['page'] = messages.nextPage;
        return conver;
      }),
    );

    const paginationData: PaginationData = {
      data: newConversation,
      lastPage,
      prevPage,
      nextPage,
    };

    return paginationData;
  }

  async findOne(id: string) {
    const conversation = await this.conversationRepo.findOne({
      where: { id },
      relations: ['user', 'shop'],
      select: {
        user: {
          userName: true,
          avatar: true,
          id: true,
        },
        shop: {
          userName: true,
          avatar: true,
          id: true,
        },
      },
    });
    if (!conversation) throw new NotFoundException();
    const messages = await this.findAllMessage({
      page: 1,
      limit: 20,
      conversationId: conversation.id,
    });
    conversation.messages = messages.data;
    conversation['page'] = messages.nextPage;
    return conversation;
  }

  async findOneByUserAndShop(userId: string, shopId: string) {
    const conversation = await this.conversationRepo.findOne({
      where: { user: { id: userId }, shop: { id: shopId } },
      relations: ['user', 'shop'],
      select: {
        user: {
          userName: true,
          avatar: true,
          id: true,
        },
        shop: {
          userName: true,
          avatar: true,
          id: true,
        },
      },
    });
    if (!conversation) throw new NotFoundException();
    const messages = await this.findAllMessage({
      page: 1,
      limit: 20,
      conversationId: conversation.id,
    });
    conversation.messages = messages.data;
    conversation['page'] = messages.nextPage;
    return conversation;
  }

  async getConversation(id: string) {
    return await this.conversationRepo.findOne({
      where: { id },
      relations: ['user', 'shop'],
      select: {
        user: {
          userName: true,
          avatar: true,
          id: true,
        },
        shop: {
          userName: true,
          avatar: true,
          id: true,
        },
      },
    });
  }

  async findOneByUser(dto: CreateConversationDto) {
    const { shopId, id } = dto;
    return await this.conversationRepo.findOneBy({
      shop: { id: shopId },
      user: { id: id },
    });
  }

  async createMessage(createMessage: CreateMessage) {
    const { content, urls, conversationId, shop, user } = createMessage;
    const conversation = await this.findOne(conversationId);
    if (!conversation) {
      throw new NotFoundException();
    }

    const message = await this.messageRepo.save({
      content,
      conversation,
      shop,
      user,
    });

    if (urls?.length) {
      const imageMessages = urls.map((url) => ({
        url,
        messageConversation: message,
      }));
      await this.imageMessageRepo.save(imageMessages);
    }
    return { message, conversation };
  }

  async updateMessage(id: number, updateMessage: UpdateMessage) {
    const messsage = await this.messageRepo.findOne({
      where: {
        id,
      },
    });
    if (!messsage) {
      throw new BadRequestException('Not accept!');
    }
    return await this.messageRepo.save({
      ...updateMessage.message,
    });
  }

  async findMessageByUser({
    id,
    userId,
    shopId,
  }: {
    id: number;
    userId?: string;
    shopId?: string;
  }) {
    return await this.messageRepo.findOne({
      where: { id, user: { id: userId }, shop: { id: shopId } },
      relations: [
        'user',
        'shop',
        'images',
        'replyMessage',
        'replyMessage.message',
        'replyMessage.message.user',
        'replyMessage.message.shop',
      ],
      select: {
        ...MessageConversation,
        user: { userName: true, avatar: true, id: true },
        shop: { userName: true, avatar: true, id: true },
        replyMessage: {
          id: true,
          message: {
            content: true,
            user: { userName: true, avatar: true, id: true },
            shop: { userName: true, avatar: true, id: true },
          },
        },
      },
    });
  }

  async findMessageById(id: number) {
    return await this.messageRepo.findOne({
      where: { id },
      relations: [
        'user',
        'shop',
        'images',
        'replyMessage',
        'replyMessage.message',
        'replyMessage.message.user',
        'replyMessage.message.shop',
      ],
      select: {
        ...MessageConversation,
        user: { userName: true, avatar: true, id: true },
        shop: { userName: true, avatar: true, id: true },
        replyMessage: {
          id: true,
          message: {
            content: true,
            user: { userName: true, avatar: true, id: true },
            shop: { userName: true, avatar: true, id: true },
          },
        },
      },
    });
  }

  async deleteMessage({
    id,
    userId,
    shopId,
  }: {
    id: number;
    userId?: string;
    shopId?: string;
  }) {
    const message = await this.findMessageByUser({ id, userId, shopId });
    if (!message) throw new UnauthorizedException();
    return await this.messageRepo.save({ ...message, deletedAt: new Date() });
  }

  async findAllMessage(
    findAllMessageDto: FindAllMessageDto,
  ): Promise<PaginationData> {
    const { page, limit, conversationId } = findAllMessageDto;
    const [res, total] = await this.getMessagesByConversation(
      conversationId,
      +page,
      +limit,
    );
    const paginationData = this.getPaginationData(+page, +limit, total);
    return { ...paginationData, data: res };
  }

  private async getMessagesByConversation(
    conversationId: string,
    page: number,
    limit: number,
  ): Promise<[MessageConversation[], number]> {
    const skip = limit * (page - 1);
    return this.messageRepo.findAndCount({
      where: { conversation: { id: conversationId } },
      relations: [
        'user',
        'shop',
        'images',
        'replyMessage',
        'replyMessage.message',
        'replyMessage.message.user',
        'replyMessage.message.shop',
      ],
      select: {
        ...MessageConversation,
        user: { userName: true, avatar: true, id: true },
        shop: { userName: true, avatar: true, id: true },
        replyMessage: {
          id: true,
          message: {
            content: true,
            user: { userName: true, avatar: true, id: true },
            shop: { userName: true, avatar: true, id: true },
          },
        },
      },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  private getPaginationData(
    page: number,
    limit: number,
    total: number,
  ): PaginationData {
    const lastPage = Math.ceil(total / limit);
    let prevPage: number | null = null;
    let nextPage: number | null = null;

    if (page > 1) {
      prevPage = page - 1;
    }

    if (page < lastPage) {
      nextPage = page + 1;
    }

    return { lastPage, prevPage, nextPage };
  }

  async createReplyMessage(createReply: CreateReplyDto) {
    const checkMessage = await this.findMessageById(createReply.messageId);
    if (!checkMessage) throw new NotFoundException('Message not found!');
    const { message, conversation } = await this.createMessage(createReply);
    const replyMessage = await this.replyMessageRepo.save({
      message: checkMessage,
    });
    const newMessage = await this.messageRepo.save({
      ...message,
      replyMessage,
    });
    return { message: newMessage, conversation };
  }
}
