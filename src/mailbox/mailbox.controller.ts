import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MailboxService } from './mailbox.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UserGuard } from 'src/utils/guards/user.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Mailbox')
@ApiHeader({
  name: 'user-id',
  description: 'Predefined User ID - 1',
  required: true,
})
@Controller('v1/mailbox')
@UseGuards(UserGuard)
export class MailboxController {
  constructor(private readonly mailboxService: MailboxService) {}

  @Get('/welcome')
  @ApiOperation({ summary: 'Welcome the user with messages count' })
  @ApiResponse({ status: 200, description: 'Welcome message and user details' })
  async welcomeUser() {
    return await this.mailboxService.welcomeUser();
  }

  @Get('/messages')
  @ApiOperation({ summary: 'Get paginated messages' })
  @ApiResponse({ status: 200, description: 'List of messages' })
  async getMessages(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.mailboxService.getMessages(page, limit);
  }

  @Get('/message/:messageId')
  @ApiOperation({ summary: 'Get a message by ID' })
  @ApiResponse({ status: 200, description: 'Message details' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async getMessageById(@Param('messageId') messageId: string) {
    return await this.mailboxService.getMessageById(messageId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, description: 'Message created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return await this.mailboxService.createMessage(createMessageDto);
  }

  @Put('/messages')
  @ApiOperation({ summary: 'Mark a message as read' })
  @ApiResponse({ status: 200, description: 'Message marked as read' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async updateMessagAsRead(@Body() body: { messageId: string }) {
    return await this.mailboxService.updateMessageAsRead(body.messageId);
  }
}
