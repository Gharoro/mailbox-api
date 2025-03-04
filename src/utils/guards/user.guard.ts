import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { user } from 'src/constants/user';

@Injectable()
export class UserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const userId = request.headers['user-id'];

    if (!userId) {
      throw new BadRequestException('User ID is missing from headers');
    }

    if (Number(userId) !== user.userId) {
      throw new UnauthorizedException(
        'Invalid User ID, use only the predefined userId',
      );
    }

    return true;
  }
}
