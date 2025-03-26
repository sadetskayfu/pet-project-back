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
				label: country.name,
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
				name: 'Action',
			},
			{
				name: 'Adventure',
			},
			{
				name: 'Comedy',
			},
			{
				name: 'Drama',
			},
			{
				name: 'Horror',
			},
			{
				name: 'Triller',
			},
		],
		skipDuplicates: true,
	});

	console.log('Таблица жанров успешно заполнена!');
}

async function seedActors() {
	const actorArray = Array.from({length: 200}, (_, index) => ({
		firstName: `FirstName${index}`,
		lastName: `LastName${index}`,
		birthDate: new Date()
	}))

	await prisma.actor.createMany({
		data: actorArray,
	})

	console.log('Таблица акторов успешно заполнена!');
}

seedActors()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

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
