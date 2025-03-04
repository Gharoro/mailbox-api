import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Subject of the message',
    example: 'Hello World',
  })
  @IsString()
  @IsNotEmpty({ message: 'Subject is required' })
  subject: string;

  @ApiProperty({
    description: 'Content of the message',
    example: 'This is a test message.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;
}
