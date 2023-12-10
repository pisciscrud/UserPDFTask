import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateJWTToken(id: string) {
    const payload = { id };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('SECRET'),
      expiresIn: '24h',
    });
  }
}
