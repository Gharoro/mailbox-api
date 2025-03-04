import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { MailboxModule } from './mailbox/mailbox.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [MailboxModule, HealthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
