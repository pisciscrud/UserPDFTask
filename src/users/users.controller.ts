import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { JwtAuthGuard } from 'src/auth/guards/auth-guard';
import { CreateUserDTO, EmailParam, UpdateUserDTO } from 'src/dto/user';
import { UsersService } from './users.service';
import * as path from 'path';

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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/img',
        filename: (req, file, cb) => {
          cb(null, `${uuid()}${path.extname(file.originalname)}`);
        },
      }),
    }),
  )
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/img',
        filename: (req, file, cb) => {
          cb(null, `${uuid()}${path.extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Put('/update/:id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDTO,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    file: Express.Multer.File,
  ) {
    return await this.userService.updateUser(id, dto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/generatePDF')
  async generatePDF(@Body() dto: EmailParam) {
    const result = await this.userService.GeneratePDF(dto.email);
    return { result };
  }
}
