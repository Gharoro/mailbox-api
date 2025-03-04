import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { user } from 'src/constants/user';
import { ApiResponse } from 'src/interface/interface';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MailboxService {
  constructor(private readonly prisma: PrismaService) {}

  async welcomeUser(): Promise<ApiResponse> {
    const [totalMessages, totalUnreadMessages] = await Promise.all([
      this.prisma.message.count(),
      this.prisma.message.count({
        where: { isRead: false },
      }),
    ]);

    const result = {
      user,
      totalMessages,
      totalUnreadMessages,
    };

    return { message: 'Welcome', data: result };
  }

  async getMessages(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse> {
    const pageNum = Number(page);
    const limitNum = Number(limit);

    if (pageNum < 1 || limitNum < 1) {
      throw new BadRequestException('Page and limit must be positive numbers');
    }
    // Calculate offset and total pages
    const offset = (pageNum - 1) * limitNum;

    const totalMessages = await this.prisma.message.count();

    const totalPages = Math.ceil(totalMessages / limitNum);

    // Fetch paginated messages
    const messages = await this.prisma.message.findMany({
      skip: offset,
      take: limitNum,
      orderBy: {
        createdAt: 'desc', // returns most recent messages
      },
    });

    // Determine if there's a next or previous page
    const hasNextPage = pageNum < totalPages;
    const hasPreviousPage = pageNum > 1;

    // Calculate nextPage and previousPage
    const nextPage = hasNextPage ? pageNum + 1 : null;
    const previousPage = hasPreviousPage ? pageNum - 1 : null;

    const result = {
      messages,
      pagination: {
        currentPage: pageNum,
        limitNum,
        nextPage,
        previousPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        totalMessages,
      },
    };

    return { message: 'Messages retrieved', data: result };
  }

  async getMessageById(messageId: string): Promise<ApiResponse> {
    if (!messageId) {
      throw new BadRequestException('Message ID is required');
    }

    const numMessageId = Number(messageId);

    const message = await this.prisma.message.findUnique({
      where: { id: numMessageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return { message: 'Message retrieved', data: message };
  }

  async createMessage(dto: CreateMessageDto): Promise<ApiResponse> {
    const newMessage = await this.prisma.message.create({
      data: {
        subject: dto.subject,
        content: dto.content,
      },
    });

    return { message: 'Message created', data: { message: newMessage } };
  }

  async updateMessageAsRead(messagedId: string): Promise<ApiResponse> {
    if (!messagedId) {
      throw new BadRequestException('Message ID is required');
    }

    const numMessageId = Number(messagedId);

    try {
      await this.prisma.message.update({
        where: { id: numMessageId },
        data: { isRead: true }, // marks a message as read
        select: { id: true },
      });

      return { message: 'Message updated' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Message not found');
      }
      throw error;
    }
  }
}
