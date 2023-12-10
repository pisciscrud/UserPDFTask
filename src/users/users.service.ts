import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/user';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import * as PDFDocument from 'pdfkit-table';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async uploadPhotoOnServer(file: Express.Multer.File) {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const relativeFolderPath = 'src/images';
    const filePath = path.join(relativeFolderPath, fileName);
    await fs.promises.writeFile(filePath, file.buffer);

    return filePath;
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findByPayload(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getUserInfoById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createUser(dto: CreateUserDTO, file: Express.Multer.File) {
    const filePath = await this.uploadPhotoOnServer(file);
    dto.password = await this.hashPassword(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        image: filePath,
      },
    });
    return newUser;
  }

  async deleteUser(id: string) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!existUser) {
      throw new HttpException('No user in database', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async updateUser(
    id: string,
    dto: Partial<CreateUserDTO>,
    file: Express.Multer.File,
  ) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existUser) {
      throw new HttpException('No user in database', HttpStatus.NOT_FOUND);
    }

    const filePath = file
      ? await this.uploadPhotoOnServer(file)
      : existUser.image;

    await this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
        image: filePath,
      },
    });
  }
  //
}
