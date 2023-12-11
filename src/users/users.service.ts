import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/user';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import * as PDFDocument from 'pdfkit';
import { join } from 'path';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    const transformedUsers = users.map((item) => ({
      ...item,
      image: `http://localhost:3000/img/${item.image}`,
    }));
    return transformedUsers;
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
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (user) {
      throw new BadRequestException(
        'User with email provided is already exist',
      );
    }
    dto.password = await this.hashPassword(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        image: file.filename,
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

  async updateUser(id: string, dto: UpdateUserDTO, file: Express.Multer.File) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existUser) {
      throw new HttpException('No user in database', HttpStatus.NOT_FOUND);
    }

    const filePath = file?.filename;

    return await this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
        ...(!!filePath && { image: filePath }),
      },
    });
  }

  async GeneratePDF(email: string) {
    const userInfo = await this.findUserByEmail(email);
    if (!userInfo) {
      throw new HttpException('No user in database', HttpStatus.NOT_FOUND);
    }
    const photo = await fs.readFile(
      `${join(__dirname, '../../../public/img')}/${userInfo.image}`,
    );

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });

      doc.text(`first name: ${userInfo.firstName}`, 100, 50);
      doc.text(`last name: ${userInfo.lastName}`, 100, 80);
      doc.image(photo, 300, 300);
      doc.end();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', async () => {
        const data = Buffer.concat(buffer);
        await this.prisma.user.update({
          where: {
            id: userInfo.id,
          },
          data: {
            pdf: data,
          },
        });
        resolve(data);
      });
    });

    return pdfBuffer ? true : false;
  }
}
