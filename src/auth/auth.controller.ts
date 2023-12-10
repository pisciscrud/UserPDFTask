import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { LoginUserDTO } from 'src/dto/user';
import { UsersService } from 'src/users/users.service';
import { TokenService } from './token/token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}
  @Post('login')
  async login(
    @Body() dto: LoginUserDTO,
  ) {
    const existUser = await this.userService.findUserByEmail(dto.email);
    if (!existUser) {
      throw new HttpException(
        'No user with such login',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordVerification = await bcrypt.compare(
      dto.password,
      existUser.password,
    );
    if (!passwordVerification) {
      throw new HttpException('Wrong data', HttpStatus.BAD_REQUEST);
    }
    const token =  this.tokenService.generateJWTToken(existUser.id);

    return { token };
  }
}
