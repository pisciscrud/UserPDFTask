import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
