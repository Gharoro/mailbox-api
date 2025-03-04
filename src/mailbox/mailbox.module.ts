import { Module } from '@nestjs/common';
import { MailboxService } from './mailbox.service';
import { MailboxController } from './mailbox.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MailboxController],
  providers: [MailboxService, PrismaService],
})
export class MailboxModule {}
