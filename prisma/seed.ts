import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const seeder = new PrismaClient();

const bootstrap = async () => {
  try {
    const hash = await bcrypt.hash('password', 10);

    const user = await seeder.user.findFirst({
      where: { email: 'admin@admin.com' },
    });

    if (user) return;

    await seeder.user.create({
      data: {
        firstName: 'admin',
        lastName: 'admin',
        email: 'admin@admin.com',
        image: 'fb476846-a941-4685-9c3a-557a4ced78ff.png',
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
