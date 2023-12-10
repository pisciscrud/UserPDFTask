import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const seeder = new PrismaClient();

const bootstrap = async () => {
  try {
    const hash = await bcrypt.hash('password', 10);

    await seeder.user.create({
      data: {
        firstName: 'admin',
        lastName: 'admin',
        email: 'admin@admin.com',
        image: 'src\\images\\dcf9e2e5-9b6a-412a-bd90-e3f57d8e97f4.png',
        password: hash,
      },
    });
  } catch (error: any) {
    console.error(error);
  } finally {
    await seeder.$disconnect();
  }
};

bootstrap();
