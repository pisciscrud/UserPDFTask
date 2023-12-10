import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponceUserDTO } from 'src/dto/user';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(payload: any): Promise<ResponceUserDTO> {
    const user = await this.userService.findByPayload(payload.user);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
