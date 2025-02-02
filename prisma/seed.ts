import { PrismaClient } from '@prisma/client';
import { getData } from 'country-list';

const prisma = new PrismaClient();

async function seedCountries() {
  const countries = getData()

  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: {}, // Если страна уже существует, ничего не обновляем
      create: {
        code: country.code, // Код страны (Alpha-2)
        name: country.name,
      },
    });
  }

  console.log('Таблица стран успешно заполнена!');
}

seedCountries()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });