import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { TokenService } from './auth/token/token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersModule, AuthModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, UsersController, AuthController],
  providers: [
    AppService,
    PrismaService,
    UsersService,
    AuthService,
    TokenService,
    JwtService,
  ],
})
export class AppModule {}
