import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/auth/guards/auth-guard';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-info/:id')
  async getInfoById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUserInfoById(id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/create')
  async createUser(
    @Body() dto: CreateUserDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const newUser = await this.userService.createUser(dto, file);
    return newUser;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Put('/update/:id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateUserDTO>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(dto);
    await this.userService.updateUser(id, dto, file);
  }
}
