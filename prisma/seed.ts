import { PrismaClient } from '@prisma/client';
import { getData } from 'country-list';

const prisma = new PrismaClient();

async function seedCountries() {
	const countries = getData();

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

async function seedRoles() {
	await prisma.role.createMany({
		data: [
			{
				name: 'user',
			},
			{
				name: 'admin',
			},
		],
		skipDuplicates: true,
	});

	console.log('Таблица ролей успешно заполнена!');
}

async function seedGenres() {
	await prisma.genre.createMany({
		data: [
			{
				name: 'action',
			},
			{
				name: 'adventure',
			},
			{
				name: 'comedy',
			},
			{
				name: 'drama',
			},
			{
				name: 'horror',
			},
			{
				name: 'triller',
			},
		],
		skipDuplicates: true,
	});

	console.log('Таблица жанров успешно заполнена!');
}

seedCountries()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

seedRoles()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

seedGenres()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
