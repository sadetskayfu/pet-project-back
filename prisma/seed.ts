import { PrismaClient } from '@prisma/client';
import { getData } from 'country-list';

const prisma = new PrismaClient();

const actors = [
	{
		firstName: 'Robert',
		lastName: 'De Niro',
		birthDate: new Date('1943-08-17'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Robert_De_Niro_Cannes_2016.jpg/220px-Robert_De_Niro_Cannes_2016.jpg',
	},
	{
		firstName: 'Meryl',
		lastName: 'Streep',
		birthDate: new Date('1949-06-22'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Meryl_Streep_December_2018.jpg/220px-Meryl_Streep_December_2018.jpg',
	},
	{
		firstName: 'Leonardo',
		lastName: 'DiCaprio',
		birthDate: new Date('1974-11-11'),
		photoUrl:
			'https://avatars.mds.yandex.net/get-kinopoisk-image/1898899/946043b5-213b-4cd3-8c5f-ccf9c7d051cd/1920x',
	},
	{
		firstName: 'Natalie',
		lastName: 'Portman',
		birthDate: new Date('1981-06-09'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Natalie_Portman_%282017%29.jpg/220px-Natalie_Portman_%282017%29.jpg',
	},
	{
		firstName: 'Tom',
		lastName: 'Hanks',
		birthDate: new Date('1956-07-09'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tom_Hanks_TIFF_2019.jpg/220px-Tom_Hanks_TIFF_2019.jpg',
	},
	{
		firstName: 'Scarlett',
		lastName: 'Johansson',
		birthDate: new Date('1984-11-22'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Scarlett_Johansson_by_Gage_Skidmore_2_%28cropped%29.jpg/220px-Scarlett_Johansson_by_Gage_Skidmore_2_%28cropped%29.jpg',
	},
	{
		firstName: 'Brad',
		lastName: 'Pitt',
		birthDate: new Date('1963-12-18'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Brad_Pitt_2019_by_Glenn_Francis.jpg/220px-Brad_Pitt_2019_by_Glenn_Francis.jpg',
	},
	{
		firstName: 'Julia',
		lastName: 'Roberts',
		birthDate: new Date('1967-10-28'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Julia_Roberts_2011_Shankbone_3.JPG/220px-Julia_Roberts_2011_Shankbone_3.JPG',
	},
	{
		firstName: 'Denzel',
		lastName: 'Washington',
		birthDate: new Date('1954-12-28'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Denzel_Washington_2016.jpg/220px-Denzel_Washington_2016.jpg',
	},
	{
		firstName: 'Anne',
		lastName: 'Hathaway',
		birthDate: new Date('1982-11-12'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Anne_Hathaway_2016.jpg/220px-Anne_Hathaway_2016.jpg',
	},
	{
		firstName: 'Johnny',
		lastName: 'Depp',
		birthDate: new Date('1963-06-09'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Johnny_Depp-2757_%28cropped%29.jpg/220px-Johnny_Depp-2757_%28cropped%29.jpg',
	},
	{
		firstName: 'Morgan',
		lastName: 'Freeman',
		birthDate: new Date('1937-06-01'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Morgan_Freeman_Deauville_2018.jpg/220px-Morgan_Freeman_Deauville_2018.jpg',
	},
	{
		firstName: 'Angelina',
		lastName: 'Jolie',
		birthDate: new Date('1975-06-04'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Angelina_Jolie_2_June_2014_%28cropped%29.jpg/220px-Angelina_Jolie_2_June_2014_%28cropped%29.jpg',
	},
	{
		firstName: 'Christian',
		lastName: 'Bale',
		birthDate: new Date('1974-01-30'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Christian_Bale-7834_%28cropped%29.jpg/220px-Christian_Bale-7834_%28cropped%29.jpg',
	},
	{
		firstName: 'Sandra',
		lastName: 'Bullock',
		birthDate: new Date('1964-07-26'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Sandra_Bullock_by_Gage_Skidmore_2.jpg/220px-Sandra_Bullock_by_Gage_Skidmore_2.jpg',
	},
	{
		firstName: 'Al',
		lastName: 'Pacino',
		birthDate: new Date('1940-04-25'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Al_Pacino_-_HFF_2024.jpg/220px-Al_Pacino_-_HFF_2024.jpg',
	},
	{
		firstName: 'Kate',
		lastName: 'Winslet',
		birthDate: new Date('1975-10-05'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Kate_Winslet_%28Berlin_2024%29_03_%28cropped%29.jpg/220px-Kate_Winslet_%28Berlin_2024%29_03_%28cropped%29.jpg',
	},
	{
		firstName: 'Will',
		lastName: 'Smith',
		birthDate: new Date('1968-09-25'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Will_Smith_2023_%28cropped%29.jpg/220px-Will_Smith_2023_%28cropped%29.jpg',
	},
	{
		firstName: 'Jennifer',
		lastName: 'Lawrence',
		birthDate: new Date('1990-08-15'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Jennifer_Lawrence_at_the_83rd_Academy_Awards.jpg/220px-Jennifer_Lawrence_at_the_83rd_Academy_Awards.jpg',
	},
	{
		firstName: 'Harrison',
		lastName: 'Ford',
		birthDate: new Date('1942-07-13'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Harrison_Ford_%282019%29_3_%28cropped%29.jpg/220px-Harrison_Ford_%282019%29_3_%28cropped%29.jpg',
	},
	{
		firstName: 'Marlon',
		lastName: 'Brando',
		birthDate: new Date('1924-04-03'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Marlon_Brando_%28cropped%29.jpg/220px-Marlon_Brando_%28cropped%29.jpg',
	},
	{
		firstName: 'Audrey',
		lastName: 'Hepburn',
		birthDate: new Date('1929-05-04'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Audrey_Hepburn_1956.jpg/220px-Audrey_Hepburn_1956.jpg',
	},
	{
		firstName: 'Jack',
		lastName: 'Nicholson',
		birthDate: new Date('1937-04-22'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Jack_Nicholson_2002.jpg/220px-Jack_Nicholson_2002.jpg',
	},
	{
		firstName: 'Cate',
		lastName: 'Blanchett',
		birthDate: new Date('1969-05-14'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Cate_Blanchett-5883_%28cropped%29.jpg/220px-Cate_Blanchett-5883_%28cropped%29.jpg',
	},
	{
		firstName: 'George',
		lastName: 'Clooney',
		birthDate: new Date('1961-05-06'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/George_Clooney_2016.jpg/220px-George_Clooney_2016.jpg',
	},
	{
		firstName: 'Nicole',
		lastName: 'Kidman',
		birthDate: new Date('1967-06-20'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Nicole_Kidman_%285849106131%29_%28cropped%29.jpg/220px-Nicole_Kidman_%285849106131%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Russell',
		lastName: 'Crowe',
		birthDate: new Date('1964-04-07'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Russell_Crowe_2017_%28cropped%29.jpg/220px-Russell_Crowe_2017_%28cropped%29.jpg',
	},
	{
		firstName: 'Amy',
		lastName: 'Adams',
		birthDate: new Date('1974-08-20'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Amy_Adams_Vice_%28cropped%29.jpg/220px-Amy_Adams_Vice_%28cropped%29.jpg',
	},
	{
		firstName: 'Clint',
		lastName: 'Eastwood',
		birthDate: new Date('1930-05-31'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Clint_Eastwood_at_2010_New_York_Film_Festival.jpg/220px-Clint_Eastwood_at_2010_New_York_Film_Festival.jpg',
	},
	{
		firstName: 'Emma',
		lastName: 'Stone',
		birthDate: new Date('1988-11-06'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Emma_Stone_in_2024_%286%29_%28cropped%29.jpg/220px-Emma_Stone_in_2024_%286%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Daniel',
		lastName: 'Day-Lewis',
		birthDate: new Date('1957-04-29'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Daniel_Day-Lewis_%282013%29_%28cropped%29.jpg/220px-Daniel_Day-Lewis_%282013%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Keanu',
		lastName: 'Reeves',
		birthDate: new Date('1964-09-02'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Keanu_Reeves_%28crop_and_levels%29_%28cropped%29.jpg/220px-Keanu_Reeves_%28crop_and_levels%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Halle',
		lastName: 'Berry',
		birthDate: new Date('1966-08-14'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Halle_Berry_by_Gage_Skidmore_2.jpg/220px-Halle_Berry_by_Gage_Skidmore_2.jpg',
	},
	{
		firstName: 'Jim',
		lastName: 'Carrey',
		birthDate: new Date('1962-01-17'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Jim_Carrey_2008.jpg/220px-Jim_Carrey_2008.jpg',
	},
	{
		firstName: 'Jessica',
		lastName: 'Chastain',
		birthDate: new Date('1977-03-24'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Jessica_Chastain_Cannes_2016_%28cropped%29.jpg/220px-Jessica_Chastain_Cannes_2016_%28cropped%29.jpg',
	},
	{
		firstName: 'Tom',
		lastName: 'Cruise',
		birthDate: new Date('1962-07-03'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Tom_Cruise_by_Gage_Skidmore_2.jpg/220px-Tom_Cruise_by_Gage_Skidmore_2.jpg',
	},
	{
		firstName: 'Margot',
		lastName: 'Robbie',
		birthDate: new Date('1990-07-02'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Margot_Robbie_at_Somerset_House_in_2013_%28cropped%29.jpg/220px-Margot_Robbie_at_Somerset_House_in_2013_%28cropped%29.jpg',
	},
	{
		firstName: 'Anthony',
		lastName: 'Hopkins',
		birthDate: new Date('1937-12-31'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/AnthonyHopkins10TIFF_%28cropped%29.jpg/220px-AnthonyHopkins10TIFF_%28cropped%29.jpg',
	},
	{
		firstName: 'Zendaya',
		lastName: 'Maree',
		birthDate: new Date('1996-09-01'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Zendaya_2021_Spider-Man_No_Way_Home_premiere_%28cropped%29.jpg/220px-Zendaya_2021_Spider-Man_No_Way_Home_premiere_%28cropped%29.jpg',
	},
	{
		firstName: 'Robert',
		lastName: 'Downey Jr.',
		birthDate: new Date('1965-04-04'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/220px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg',
	},
	{
		firstName: 'Jodie',
		lastName: 'Foster',
		birthDate: new Date('1962-11-19'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Jodie_Foster_C%C3%A9sars_2011_2_%28cropped%29.jpg/220px-Jodie_Foster_C%C3%A9sars_2011_2_%28cropped%29.jpg',
	},
	{
		firstName: 'Matt',
		lastName: 'Damon',
		birthDate: new Date('1970-10-08'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Matt_Damon_%282017%29.jpg/220px-Matt_Damon_%282017%29.jpg',
	},
	{
		firstName: 'Viola',
		lastName: 'Davis',
		birthDate: new Date('1965-08-11'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Viola_Davis_by_Gage_Skidmore_%28cropped%29.jpg/220px-Viola_Davis_by_Gage_Skidmore_%28cropped%29.jpg',
	},
	{
		firstName: 'Bruce',
		lastName: 'Willis',
		birthDate: new Date('1955-03-19'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Bruce_Willis_by_Gage_Skidmore_3.jpg/220px-Bruce_Willis_by_Gage_Skidmore_3.jpg',
	},
	{
		firstName: 'Saoirse',
		lastName: 'Ronan',
		birthDate: new Date('1994-04-12'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Saoirse_Ronan_at_2024_Berlinale_%28crop%29.jpg/220px-Saoirse_Ronan_at_2024_Berlinale_%28crop%29.jpg',
	},
	{
		firstName: 'Sylvester',
		lastName: 'Stallone',
		birthDate: new Date('1946-07-06'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Sylvester_Stallone_%28cropped%29.jpg/220px-Sylvester_Stallone_%28cropped%29.jpg',
	},
	{
		firstName: 'Michelle',
		lastName: 'Pfeiffer',
		birthDate: new Date('1958-04-29'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Michelle_Pfeiffer_2018_%28cropped%29.jpg/220px-Michelle_Pfeiffer_2018_%28cropped%29.jpg',
	},
	{
		firstName: 'Ryan',
		lastName: 'Gosling',
		birthDate: new Date('1980-11-12'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Ryan_Gosling_in_2023_%28cropped%29.jpg/220px-Ryan_Gosling_in_2023_%28cropped%29.jpg',
	},
	{
		firstName: 'Sigourney',
		lastName: 'Weaver',
		birthDate: new Date('1949-10-08'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Sigourney_Weaver_%285849105607%29_%28cropped%29.jpg/220px-Sigourney_Weaver_%285849105607%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Hugh',
		lastName: 'Jackman',
		birthDate: new Date('1968-10-12'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Hugh_Jackman_%282017%29.jpg/220px-Hugh_Jackman_%282017%29.jpg',
	},
	{
		firstName: 'Uma',
		lastName: 'Thurman',
		birthDate: new Date('1970-04-29'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Uma_Thurman_Cannes_2017_%28cropped%29.jpg/220px-Uma_Thurman_Cannes_2017_%28cropped%29.jpg',
	},
	{
		firstName: 'Chris',
		lastName: 'Hemsworth',
		birthDate: new Date('1983-08-11'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Chris_Hemsworth_by_Gage_Skidmore_2_%28cropped%29.jpg/220px-Chris_Hemsworth_by_Gage_Skidmore_2_%28cropped%29.jpg',
	},
	{
		firstName: 'Tilda',
		lastName: 'Swinton',
		birthDate: new Date('1960-11-05'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Tilda_Swinton_%2827176519178%29_%28cropped%29.jpg/220px-Tilda_Swinton_%2827176519178%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Mark',
		lastName: 'Ruffalo',
		birthDate: new Date('1967-11-22'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Mark_Ruffalo_%282017%29_%28cropped%29.jpg/220px-Mark_Ruffalo_%282017%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Salma',
		lastName: 'Hayek',
		birthDate: new Date('1966-09-02'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Salma_Hayek_at_the_2024_TIFF_%28cropped%29.jpg/220px-Salma_Hayek_at_the_2024_TIFF_%28cropped%29.jpg',
	},
	{
		firstName: 'Joaquin',
		lastName: 'Phoenix',
		birthDate: new Date('1974-10-28'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Joaquin_Phoenix_in_2018_%28cropped%29.jpg/220px-Joaquin_Phoenix_in_2018_%28cropped%29.jpg',
	},
	{
		firstName: 'Penélope',
		lastName: 'Cruz',
		birthDate: new Date('1974-04-28'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Pen%C3%A9lope_Cruz_-_2018_%28cropped%29.jpg/220px-Pen%C3%A9lope_Cruz_-_2018_%28cropped%29.jpg',
	},
	{
		firstName: 'Chris',
		lastName: 'Pratt',
		birthDate: new Date('1979-06-21'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Chris_Pratt_2018_%28cropped%29.jpg/220px-Chris_Pratt_2018_%28cropped%29.jpg',
	},
	{
		firstName: 'Reese',
		lastName: 'Witherspoon',
		birthDate: new Date('1976-03-22'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Reese_Witherspoon_2012_-_2_%28cropped%29.jpg/220px-Reese_Witherspoon_2012_-_2_%28cropped%29.jpg',
	},
	{
		firstName: 'Jake',
		lastName: 'Gyllenhaal',
		birthDate: new Date('1980-12-19'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Jake_Gyllenhaal_2019_%28cropped%29.jpg/220px-Jake_Gyllenhaal_2019_%28cropped%29.jpg',
	},
	{
		firstName: 'Kristen',
		lastName: 'Stewart',
		birthDate: new Date('1990-04-09'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Kristen_Stewart_by_Gage_Skidmore_%28cropped%29.jpg/220px-Kristen_Stewart_by_Gage_Skidmore_%28cropped%29.jpg',
	},
	{
		firstName: 'Benedict',
		lastName: 'Cumberbatch',
		birthDate: new Date('1976-07-19'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Benedict_Cumberbatch_%282021%29_%28cropped%29.jpg/220px-Benedict_Cumberbatch_%282021%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Olivia',
		lastName: 'Wilde',
		birthDate: new Date('1984-03-10'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Olivia_Wilde_%2831446922998%29_%28cropped%29.jpg/220px-Olivia_Wilde_%2831446922998%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Ryan',
		lastName: 'Reynolds',
		birthDate: new Date('1976-10-23'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Ryan_Reynolds_by_Gage_Skidmore_3_%28cropped%29.jpg/220px-Ryan_Reynolds_by_Gage_Skidmore_3_%28cropped%29.jpg',
	},
	{
		firstName: 'Emily',
		lastName: 'Blunt',
		birthDate: new Date('1983-02-23'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Emily_Blunt_SAG_Awards_2019_%28cropped%29.png/220px-Emily_Blunt_SAG_Awards_2019_%28cropped%29.png',
	},
	{
		firstName: 'Chris',
		lastName: 'Evans',
		birthDate: new Date('1981-06-13'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Chris_Evans_2022_%28cropped%29.jpg/220px-Chris_Evans_2022_%28cropped%29.jpg',
	},
	{
		firstName: 'Rachel',
		lastName: 'McAdams',
		birthDate: new Date('1978-11-17'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Rachel_McAdams_%282021%29_%28cropped%29.jpg/220px-Rachel_McAdams_%282021%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Edward',
		lastName: 'Norton',
		birthDate: new Date('1969-08-18'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Edward_Norton_%282018%29_%28cropped%29.jpg/220px-Edward_Norton_%282018%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Gwyneth',
		lastName: 'Paltrow',
		birthDate: new Date('1972-09-27'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Gwyneth_Paltrow_2011_%28cropped%29.jpg/220px-Gwyneth_Paltrow_2011_%28cropped%29.jpg',
	},
	{
		firstName: 'Samuel',
		lastName: 'L. Jackson',
		birthDate: new Date('1948-12-21'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Samuel_L._Jackson_SDCC_2014_%28cropped%29.jpg/220px-Samuel_L._Jackson_SDCC_2014_%28cropped%29.jpg',
	},
	{
		firstName: 'Keira',
		lastName: 'Knightley',
		birthDate: new Date('1985-03-26'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Keira_Knightley_at_the_2011_Toronto_Film_Festival_%28cropped%29.jpg/220px-Keira_Knightley_at_the_2011_Toronto_Film_Festival_%28cropped%29.jpg',
	},
	{
		firstName: 'Gary',
		lastName: 'Oldman',
		birthDate: new Date('1958-03-21'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Gary_Oldman_%282017%29_%28cropped%29.jpg/220px-Gary_Oldman_%282017%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Zooey',
		lastName: 'Deschanel',
		birthDate: new Date('1980-01-17'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Zooey_Deschanel_-_New_Girl_panel_-_PaleyFest_2012_%28cropped%29.jpg/220px-Zooey_Deschanel_-_New_Girl_panel_-_PaleyFest_2012_%28cropped%29.jpg',
	},
	{
		firstName: 'Heath',
		lastName: 'Ledger',
		birthDate: new Date('1979-04-04'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Heath_Ledger_%28Berlin%29.jpg/220px-Heath_Ledger_%28Berlin%29.jpg',
	},
	{
		firstName: 'Mila',
		lastName: 'Kunis',
		birthDate: new Date('1983-08-14'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Mila_Kunis_2012_%28cropped%29.jpg/220px-Mila_Kunis_2012_%28cropped%29.jpg',
	},
	{
		firstName: 'Philip',
		lastName: 'Seymour Hoffman',
		birthDate: new Date('1967-07-23'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Philip_Seymour_Hoffman_%282013%29_%28cropped%29.jpg/220px-Philip_Seymour_Hoffman_%282013%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Ellen',
		lastName: 'Page',
		birthDate: new Date('1987-02-21'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Elliot_Page_%282017%29_%28cropped%29.jpg/220px-Elliot_Page_%282017%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Robin',
		lastName: 'Williams',
		birthDate: new Date('1951-07-21'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Robin_Williams_2011a_%282%29_%28cropped%29.jpg/220px-Robin_Williams_2011a_%282%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Naomi',
		lastName: 'Watts',
		birthDate: new Date('1968-09-28'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Naomi_Watts_%282017%29_%28cropped%29.jpg/220px-Naomi_Watts_%282017%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Timothée',
		lastName: 'Chalamet',
		birthDate: new Date('1995-12-27'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Timoth%C3%A9e_Chalamet_in_2017_%28cropped%29.jpg/220px-Timoth%C3%A9e_Chalamet_in_2017_%28cropped%29.jpg',
	},
	{
		firstName: 'Brie',
		lastName: 'Larson',
		birthDate: new Date('1989-10-01'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Brie_Larson_by_Gage_Skidmore_%28cropped%29.jpg/220px-Brie_Larson_by_Gage_Skidmore_%28cropped%29.jpg',
	},
	{
		firstName: 'Paul',
		lastName: 'Newman',
		birthDate: new Date('1925-01-26'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Paul_Newman_-_Cat_on_a_Hot_Tin_Roof_trailer_%28cropped%29.jpg/220px-Paul_Newman_-_Cat_on_a_Hot_Tin_Roof_trailer_%28cropped%29.jpg',
	},
	{
		firstName: 'Katharine',
		lastName: 'Hepburn',
		birthDate: new Date('1907-05-12'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Katharine_Hepburn_promo_pic_%28cropped%29.jpg/220px-Katharine_Hepburn_promo_pic_%28cropped%29.jpg',
	},
	{
		firstName: 'Humphrey',
		lastName: 'Bogart',
		birthDate: new Date('1899-12-25'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Humphrey_Bogart_1945_%28cropped%29.jpg/220px-Humphrey_Bogart_1945_%28cropped%29.jpg',
	},
	{
		firstName: 'Bette',
		lastName: 'Davis',
		birthDate: new Date('1908-04-05'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Bette_Davis_%281938%29_%28cropped%29.jpg/220px-Bette_Davis_%281938%29_%28cropped%29.jpg',
	},
	{
		firstName: 'James',
		lastName: 'Stewart',
		birthDate: new Date('1908-05-20'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/James_Stewart_It%27s_a_Wonderful_Life_%28cropped%29.jpg/220px-James_Stewart_It%27s_a_Wonderful_Life_%28cropped%29.jpg',
	},
	{
		firstName: 'Ingrid',
		lastName: 'Bergman',
		birthDate: new Date('1915-08-29'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Ingrid_Bergman_%281945%29_%28cropped%29.jpg/220px-Ingrid_Bergman_%281945%29_%28cropped%29.jpg',
	},
	{
		firstName: 'Cary',
		lastName: 'Grant',
		birthDate: new Date('1904-01-18'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Cary_Grant_in_1941_%28cropped%29.jpg/220px-Cary_Grant_in_1941_%28cropped%29.jpg',
	},
	{
		firstName: 'Lauren',
		lastName: 'Bacall',
		birthDate: new Date('1924-09-16'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Lauren_Bacall_1945_%28cropped%29.jpg/220px-Lauren_Bacall_1945_%28cropped%29.jpg',
	},
	{
		firstName: 'Gregory',
		lastName: 'Peck',
		birthDate: new Date('1916-04-05'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Gregory_Peck_-_Roman_Holiday_trailer_%28cropped%29.jpg/220px-Gregory_Peck_-_Roman_Holiday_trailer_%28cropped%29.jpg',
	},
	{
		firstName: 'Vivien',
		lastName: 'Leigh',
		birthDate: new Date('1913-11-05'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Vivien_Leigh_-_ca._1940_%28cropped%29.JPG/220px-Vivien_Leigh_-_ca._1940_%28cropped%29.JPG',
	},
	{
		firstName: 'Clark',
		lastName: 'Gable',
		birthDate: new Date('1901-02-01'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Clark_Gable_-_publicity_%28cropped%29.JPG/220px-Clark_Gable_-_publicity_%28cropped%29.JPG',
	},
	{
		firstName: 'Marilyn',
		lastName: 'Monroe',
		birthDate: new Date('1926-06-01'),
		photoUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Marilyn_Monroe_-_publicity_%28cropped%29.JPG/220px-Marilyn_Monroe_-_publicity_%28cropped%29.JPG',
	},
];
const genres = [
	{ name: 'Action' },
	{ name: 'Adventure' },
	{ name: 'Comedy' },
	{ name: 'Drama' },
	{ name: 'Horror' },
	{ name: 'Thriller' },
	{ name: 'Romance' },
	{ name: 'Science Fiction' },
	{ name: 'Fantasy' },
	{ name: 'Mystery' },
	{ name: 'Crime' },
	{ name: 'Western' },
	{ name: 'Animation' },
	{ name: 'Documentary' },
	{ name: 'Musical' },
	{ name: 'Historical' },
	{ name: 'War' },
	{ name: 'Family' },
	{ name: 'Sports' },
	{ name: 'Biography' },
];

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
	const roles = ['user', 'admin'];

	for (const role of roles) {
		await prisma.role.upsert({
			where: {
				name: role,
			},
			update: {},
			create: {
				name: role,
			},
		});
	}

	console.log('Таблица ролей успешно заполнена!');
}

async function seedUsers() {
	const array = Array.from({ length: 100 }, (_, index) => index);

	const users = array.map((index) => {
		return {
			email: `email${index}@mail.ru`,
			hash: `fskjgkdfjgkdfgkdfg${index}`,
			salt: `dafsdlfsdl${index}`,
		};
	});

	const countries = await prisma.country.findFirst();

	for (const user of users) {
		await prisma.user.upsert({
			where: {
				email: user.email,
			},
			update: {},
			create: {
				email: user.email,
				hash: user.hash,
				salt: user.salt,
				isConfirmed: true,
				country: { connect: { code: countries?.code } },
			},
		});
	}

	console.log('Таблица пользователей успешно заполнена!');
}

async function seedGenres() {
	for (const genre of genres) {
		await prisma.genre.upsert({
			where: {
				name: genre.name,
			},
			update: {
				name: genre.name,
			},
			create: {
				name: genre.name,
			},
		});
	}

	console.log('Таблица жанров успешно заполнена!');
}

async function seedActors() {
	for (const actor of actors) {
		await prisma.actor.upsert({
			where: {
				firstName_lastName_birthDate: {
					birthDate: actor.birthDate,
					firstName: actor.firstName,
					lastName: actor.lastName,
				},
			},
			update: {
				firstName: actor.firstName,
				lastName: actor.lastName,
				birthDate: actor.birthDate,
				photoUrl: actor.photoUrl,
			},
			create: {
				firstName: actor.firstName,
				lastName: actor.lastName,
				birthDate: actor.birthDate,
				photoUrl: actor.photoUrl,
			},
		});
	}

	console.log('Таблица акторов успешно заполнена!');
}

async function seedMovies() {
	const videoPlaceholder =
		'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

	const movies = [
		{
			title: 'The Godfather',
			description:
				'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.',
			ageLimit: 18,
			releaseDate: new Date('1972-03-24'),
			releaseYear: 1972,
			duration: 175,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://www.formulatv.com/images/noticias/117700/117765/1_SJkgeHv2WUFRsNPqLBYaExo5z4c9871m0.jpg',
			countries: ['US'],
			genres: ['Crime', 'Drama'],
			actors: ['Marlon Brando', 'Al Pacino', 'Robert De Niro'],
		},
		{
			title: 'Inception',
			description:
				'A thief with the ability to enter dreams steals secrets from the subconscious.',
			ageLimit: 13,
			releaseDate: new Date('2010-07-16'),
			releaseYear: 2010,
			duration: 148,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/oYuLEt3zVCKqyOs1hF8H4oqlwvs.jpg',
			countries: ['US', 'GB'],
			genres: ['Science Fiction', 'Action', 'Thriller'],
			actors: ['Leonardo DiCaprio', 'Ellen Page'],
		},
		{
			title: 'The Dark Knight',
			description:
				'Batman faces the Joker, a criminal mastermind wreaking havoc in Gotham.',
			ageLimit: 13,
			releaseDate: new Date('2008-07-18'),
			releaseYear: 2008,
			duration: 152,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg',
			countries: ['US', 'GB'],
			genres: ['Action', 'Crime', 'Thriller'],
			actors: ['Christian Bale', 'Heath Ledger', 'Gary Oldman'],
		},
		{
			title: 'Forrest Gump',
			description:
				'The life story of a man with a low IQ who achieves extraordinary things.',
			ageLimit: 12,
			releaseDate: new Date('1994-07-06'),
			releaseYear: 1994,
			duration: 142,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/h5J4W4veyxMXDMjeNxZI46TsHOb.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/saHP97rTPS5eLmrLQEcANmKrsFl.jpg',
			countries: ['US'],
			genres: ['Drama', 'Romance'],
			actors: ['Tom Hanks', 'Robin Williams'],
		},
		{
			title: 'Pulp Fiction',
			description:
				'Interwoven stories of crime and redemption in Los Angeles.',
			ageLimit: 18,
			releaseDate: new Date('1994-10-14'),
			releaseYear: 1994,
			duration: 154,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/d5iIlFn5s0Iyr2vNC6VQVgO7DL.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/4cDFjr4Hi0Zg2GjwXwUmu4mmAD.jpg',
			countries: ['US'],
			genres: ['Crime', 'Thriller'],
			actors: ['Samuel L. Jackson', 'Uma Thurman'],
		},
		{
			title: 'Titanic',
			description: 'A tragic love story aboard the doomed RMS Titanic.',
			ageLimit: 13,
			releaseDate: new Date('1997-12-19'),
			releaseYear: 1997,
			duration: 195,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/kHXEpyfl6zqn8a6YuozZUujufXf.jpg',
			countries: ['US'],
			genres: ['Romance', 'Drama', 'Historical'],
			actors: ['Leonardo DiCaprio', 'Kate Winslet'],
		},
		{
			title: 'The Shawshank Redemption',
			description:
				'Two imprisoned men bond over decades, finding hope in despair.',
			ageLimit: 15,
			releaseDate: new Date('1994-09-23'),
			releaseYear: 1994,
			duration: 142,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/9O7gLzmreU0nGkIB6K3BsJbzvNv.jpg',
			countries: ['US'],
			genres: ['Drama'],
			actors: ['Morgan Freeman'],
		},
		{
			title: 'The Matrix',
			description:
				'A hacker discovers a simulated reality and fights to free humanity.',
			ageLimit: 15,
			releaseDate: new Date('1999-03-31'),
			releaseYear: 1999,
			duration: 136,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/f89U3ADr1Wk1vUGCLjeCpjdiPLF.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/hM0sTXkLLTjE3f5zX7oF8XmjOCZ.jpg',
			countries: ['US'],
			genres: ['Science Fiction', 'Action'],
			actors: ['Keanu Reeves'],
		},
		{
			title: 'Fight Club',
			description:
				'An insomniac and a soap salesman form an underground fight club.',
			ageLimit: 18,
			releaseDate: new Date('1999-10-15'),
			releaseYear: 1999,
			duration: 139,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/adw6Lq9FiC9zjYEpOqfq03ituwp.jpg',
			countries: ['US'],
			genres: ['Drama', 'Thriller'],
			actors: ['Brad Pitt', 'Edward Norton'],
		},
		{
			title: 'Gladiator',
			description:
				'A Roman general seeks revenge against a corrupt emperor.',
			ageLimit: 15,
			releaseDate: new Date('2000-05-05'),
			releaseYear: 2000,
			duration: 155,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/ty8TGRuvJLPUmH6TiM8PHKlgH9B.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/6WBIzCgmDCYrqh64yD2FAAoFDC.jpg',
			countries: ['US', 'GB'],
			genres: ['Action', 'Drama', 'Historical'],
			actors: ['Russell Crowe', 'Joaquin Phoenix'],
		},
		{
			title: 'The Lord of the Rings: The Fellowship of the Ring',
			description:
				'A hobbit embarks on a quest to destroy a powerful ring.',
			ageLimit: 12,
			releaseDate: new Date('2001-12-19'),
			releaseYear: 2001,
			duration: 178,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/xfK1ppvHWID8Wjk2HO3T2r2v7pP.jpg',
			countries: ['US', 'NZ'],
			genres: ['Fantasy', 'Adventure'],
			actors: ['Cate Blanchett'],
		},
		{
			title: 'Schindler’s List',
			description:
				'A businessman saves Jews from the Holocaust by employing them.',
			ageLimit: 15,
			releaseDate: new Date('1993-12-15'),
			releaseYear: 1993,
			duration: 195,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/sF1U4EUQS8YHUYjNl3pMGNIQyrV.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/2o0lpmWJC2kJny5DQK2fOQ7lQIA.jpg',
			countries: ['US'],
			genres: ['Drama', 'Historical', 'War'],
			actors: [],
		},
		{
			title: 'The Avengers',
			description:
				'Earth’s mightiest heroes unite to stop an alien invasion.',
			ageLimit: 12,
			releaseDate: new Date('2012-05-04'),
			releaseYear: 2012,
			duration: 143,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/4cdyW59FuNiKYfOgT5fQ8jdPRsN.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
			countries: ['US'],
			genres: ['Action', 'Science Fiction'],
			actors: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
		},
		{
			title: 'Jurassic Park',
			description:
				'A theme park with cloned dinosaurs spirals out of control.',
			ageLimit: 13,
			releaseDate: new Date('1993-06-11'),
			releaseYear: 1993,
			duration: 127,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/oU7zEHcyYxOHu0p7VrJMu8dCpAV.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/c0R0FJH3MVffWnLa0dF2E1ttDNS.jpg',
			countries: ['US'],
			genres: ['Science Fiction', 'Adventure'],
			actors: [],
		},
		{
			title: 'The Lion King',
			description:
				'A young lion prince reclaims his kingdom after tragedy.',
			ageLimit: 7,
			releaseDate: new Date('1994-06-24'),
			releaseYear: 1994,
			duration: 88,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/bKPtXn9n4M4s8vvZrbw40mYsefZ.jpg',
			countries: ['US'],
			genres: ['Animation', 'Family', 'Drama'],
			actors: [],
		},
		{
			title: 'Good Will Hunting',
			description:
				'A troubled genius finds purpose through therapy and love.',
			ageLimit: 13,
			releaseDate: new Date('1997-12-05'),
			releaseYear: 1997,
			duration: 126,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/bABCBNUuHCvL1mCcsqoXI2CGOap.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/zjGntEHMEBXdYxmxkj32rjj76xf.jpg',
			countries: ['US'],
			genres: ['Drama'],
			actors: ['Matt Damon', 'Robin Williams'],
		},
		{
			title: 'The Silence of the Lambs',
			description:
				'An FBI agent seeks a cannibalistic killer’s help to catch another.',
			ageLimit: 18,
			releaseDate: new Date('1991-02-14'),
			releaseYear: 1991,
			duration: 118,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/rplLJ2mkoIKBpdDc5xCfa9KRhSP.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/uS9m8u9zGWaJrJFFUPjW3pQ19aO.jpg',
			countries: ['US'],
			genres: ['Thriller', 'Crime'],
			actors: ['Jodie Foster', 'Anthony Hopkins'],
		},
		{
			title: 'Star Wars: Episode IV - A New Hope',
			description:
				'A young farm boy joins a rebellion against an evil empire.',
			ageLimit: 10,
			releaseDate: new Date('1977-05-25'),
			releaseYear: 1977,
			duration: 121,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/tvSlBz6j50Dcb4Ltoa5TrXPyuP5.jpg',
			countries: ['US'],
			genres: ['Science Fiction', 'Adventure'],
			actors: ['Harrison Ford'],
		},
		{
			title: 'The Departed',
			description:
				'An undercover cop and a mole infiltrate each other’s worlds.',
			ageLimit: 18,
			releaseDate: new Date('2006-10-06'),
			releaseYear: 2006,
			duration: 151,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/nT97ifVT2JdfyfU6nm0VsHG2iama.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/tGLO9zw5ZtCey1ukabF4Yc4RBqC.jpg',
			countries: ['US'],
			genres: ['Crime', 'Thriller'],
			actors: ['Leonardo DiCaprio', 'Matt Damon', 'Jack Nicholson'],
		},
		{
			title: 'Saving Private Ryan',
			description: 'A squad searches for a paratrooper during WWII.',
			ageLimit: 16,
			releaseDate: new Date('1998-07-24'),
			releaseYear: 1998,
			duration: 169,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/1wZUBfCHjMusZrUjeVbeR8j3Xbg.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/jV5cG3KXhy5R2S2TXLzGsvnjkTo.jpg',
			countries: ['US'],
			genres: ['War', 'Drama'],
			actors: ['Tom Hanks', 'Matt Damon'],
		},
		{
			title: 'La La Land',
			description:
				'A musician and an actress fall in love while chasing their dreams.',
			ageLimit: 12,
			releaseDate: new Date('2016-12-09'),
			releaseYear: 2016,
			duration: 128,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/uDO8zWDhf8sYpnAuhVLepeR6Upj.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/ylXCdC106IKiarftHkcacasaAcb.jpg',
			countries: ['US'],
			genres: ['Romance', 'Musical', 'Drama'],
			actors: ['Ryan Gosling', 'Emma Stone'],
		},
		{
			title: 'The Wolf of Wall Street',
			description:
				'A stockbroker’s rise and fall through greed and excess.',
			ageLimit: 18,
			releaseDate: new Date('2013-12-25'),
			releaseYear: 2013,
			duration: 180,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/sX0jugwo6F3lUrTvpDwYQbC04Y.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/34m2BeQj5v2wCUafFzgqH8NmcZG.jpg',
			countries: ['US'],
			genres: ['Biography', 'Comedy', 'Crime'],
			actors: ['Leonardo DiCaprio', 'Margot Robbie'],
		},
		{
			title: 'Interstellar',
			description: 'Astronauts search for a new home for humanity.',
			ageLimit: 12,
			releaseDate: new Date('2014-11-07'),
			releaseYear: 2014,
			duration: 169,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg',
			countries: ['US', 'GB'],
			genres: ['Science Fiction', 'Adventure', 'Drama'],
			actors: ['Anne Hathaway', 'Jessica Chastain'],
		},
		{
			title: 'The Empire Strikes Back',
			description:
				'The Rebels face the Empire’s wrath after a devastating attack.',
			ageLimit: 10,
			releaseDate: new Date('1980-05-21'),
			releaseYear: 1980,
			duration: 124,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/2l05cFWJacyIsTpsqSgH0wQXe4V.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/7vof5ZMN4K6JkbPfTSEF3XRjqfH.jpg',
			countries: ['US'],
			genres: ['Science Fiction', 'Adventure'],
			actors: ['Harrison Ford'],
		},
		{
			title: 'Mad Max: Fury Road',
			description:
				'A high-octane chase through a post-apocalyptic wasteland.',
			ageLimit: 16,
			releaseDate: new Date('2015-05-15'),
			releaseYear: 2015,
			duration: 120,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/8tZYtuWezp8JbcsvHYO0O4XoUFO.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/hA2ple9q4qnwxp3hKVNhroipsir.jpg',
			countries: ['AU', 'US'],
			genres: ['Action', 'Science Fiction'],
			actors: ['Tom Hardy'],
		},
		{
			title: 'The Grand Budapest Hotel',
			description:
				'A concierge and his lobby boy embark on a whimsical adventure.',
			ageLimit: 13,
			releaseDate: new Date('2014-03-07'),
			releaseYear: 2014,
			duration: 99,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/nX5XotM9yprYSd58NIjkGmgLWMY.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/xvXmvus3ZBtNVQMM4NsoX8mI5bG.jpg',
			countries: ['US', 'GB'],
			genres: ['Comedy', 'Drama'],
			actors: ['Tilda Swinton'],
		},
		{
			title: 'Parasite',
			description:
				'A poor family infiltrates the lives of a wealthy household.',
			ageLimit: 15,
			releaseDate: new Date('2019-05-30'),
			releaseYear: 2019,
			duration: 132,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/TU9NIjwzjoKPwQHoHkdX3Qo45n.jpg',
			countries: ['KR'],
			genres: ['Thriller', 'Drama', 'Comedy'],
			actors: [],
		},
		{
			title: 'Django Unchained',
			description:
				'A freed slave teams up with a bounty hunter to rescue his wife.',
			ageLimit: 18,
			releaseDate: new Date('2012-12-25'),
			releaseYear: 2012,
			duration: 165,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/7oWY8VDWW7thrzbiS9kNVgS2s2B.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/5WJnxuw41sdd0mR1z2iCjIHOAeb.jpg',
			countries: ['US'],
			genres: ['Western', 'Drama'],
			actors: ['Leonardo DiCaprio'],
		},
		{
			title: 'The Prestige',
			description:
				'Two magicians engage in a bitter rivalry after a tragic accident.',
			ageLimit: 13,
			releaseDate: new Date('2006-10-20'),
			releaseYear: 2006,
			duration: 130,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/tRNxZ8z3bZMmntcM73vzNxuw0R5.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/62u4RJrfY5XuJjeHyD617r7S4iJ.jpg',
			countries: ['US', 'GB'],
			genres: ['Drama', 'Mystery', 'Thriller'],
			actors: ['Hugh Jackman', 'Christian Bale', 'Scarlett Johansson'],
		},
		{
			title: 'Avatar',
			description:
				'A marine explores a lush alien world and joins its natives.',
			ageLimit: 12,
			releaseDate: new Date('2009-12-18'),
			releaseYear: 2009,
			duration: 162,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/jRXYjXNq0Cs2TcJjLkkiOBpomox.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/kyeqWdyUXW608qlYkRqosgbbJyK.jpg',
			countries: ['US'],
			genres: ['Science Fiction', 'Adventure'],
			actors: ['Sigourney Weaver'],
		},
		{
			title: 'Braveheart',
			description:
				'A Scottish warrior leads a rebellion against English rule.',
			ageLimit: 16,
			releaseDate: new Date('1995-05-24'),
			releaseYear: 1995,
			duration: 178,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/2qAgGeYHmNzgHzVXCR1qJRxX4nl.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/or1gBugfhCpg0Nj4tCtmdjOrj8Z.jpg',
			countries: ['US'],
			genres: ['Historical', 'War', 'Drama'],
			actors: [],
		},
		{
			title: 'The Green Mile',
			description:
				'A death row guard encounters a prisoner with supernatural powers.',
			ageLimit: 15,
			releaseDate: new Date('1999-12-10'),
			releaseYear: 1999,
			duration: 189,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/velWPhVMQeQBi5O91ucOwRo6M94.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg',
			countries: ['US'],
			genres: ['Drama', 'Fantasy'],
			actors: ['Tom Hanks'],
		},
		{
			title: 'Se7en',
			description:
				'Two detectives hunt a serial killer using the seven deadly sins.',
			ageLimit: 18,
			releaseDate: new Date('1995-09-22'),
			releaseYear: 1995,
			duration: 127,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/6yoghtyTpznpBni9o7p9N2yr6.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/69Sns8tfCthr5nYV3u6T8A2W0SH.jpg',
			countries: ['US'],
			genres: ['Thriller', 'Crime', 'Mystery'],
			actors: ['Brad Pitt', 'Morgan Freeman', 'Gwyneth Paltrow'],
		},
		{
			title: 'The Usual Suspects',
			description:
				'A sole survivor recounts a heist orchestrated by a mysterious figure.',
			ageLimit: 15,
			releaseDate: new Date('1995-08-16'),
			releaseYear: 1995,
			duration: 106,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/bUPmtQzrRhzqYySeiMpv7GTD4Hm.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/19kfvGktyt2NPEwGrbWVaKtdS0y.jpg',
			countries: ['US'],
			genres: ['Crime', 'Mystery', 'Thriller'],
			actors: [],
		},
		{
			title: 'Eternal Sunshine of the Spotless Mind',
			description:
				'A couple erases each other from their memories after a breakup.',
			ageLimit: 13,
			releaseDate: new Date('2004-03-19'),
			releaseYear: 2004,
			duration: 108,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/5YjeYXcDw7X8N0K7M1u1WTRB7Pk.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/7y3eYvTsGuxWAGCE2VaoQDtRytC.jpg',
			countries: ['US'],
			genres: ['Romance', 'Drama', 'Science Fiction'],
			actors: ['Jim Carrey', 'Kate Winslet'],
		},
		{
			title: 'No Country for Old Men',
			description:
				'A hunter stumbles upon a drug deal gone wrong and a relentless killer.',
			ageLimit: 18,
			releaseDate: new Date('2007-11-09'),
			releaseYear: 2007,
			duration: 122,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/qjiskwlV1qQzRCjpV0cL9pEMF9a.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/iVLU2zWDBF8D70kH69Qjuk5un6u.jpg',
			countries: ['US'],
			genres: ['Crime', 'Thriller', 'Drama'],
			actors: [],
		},
		{
			title: 'The Big Lebowski',
			description:
				'A slacker gets caught up in a case of mistaken identity.',
			ageLimit: 15,
			releaseDate: new Date('1998-03-06'),
			releaseYear: 1998,
			duration: 117,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/xZbcXff8PXM5rWjU3bjnIuQrvTq.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/qiWnWvwpiX37Aqr2AQr0I2sMAlg.jpg',
			countries: ['US'],
			genres: ['Comedy', 'Crime'],
			actors: [],
		},
		{
			title: 'Blade Runner',
			description:
				'A detective hunts rogue replicants in a dystopian future.',
			ageLimit: 15,
			releaseDate: new Date('1982-06-25'),
			releaseYear: 1982,
			duration: 117,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/vfzE3pjE5G7G7kcZWrA3fnbZo7V.jpg',
			countries: ['US'],
			genres: ['Science Fiction', 'Thriller'],
			actors: ['Harrison Ford'],
		},
		{
			title: 'The Shining',
			description: 'A writer descends into madness in an isolated hotel.',
			ageLimit: 18,
			releaseDate: new Date('1980-05-23'),
			releaseYear: 1980,
			duration: 146,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/xbhHHa1YgtpwhC8iMXg6L7tHQyQ.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/9f5R9HQjWVG4tNeIQCkhbEan0Yx.jpg',
			countries: ['US', 'GB'],
			genres: ['Horror', 'Thriller'],
			actors: ['Jack Nicholson'],
		},
		{
			title: 'A Beautiful Mind',
			description:
				'A mathematician battles schizophrenia while making groundbreaking discoveries.',
			ageLimit: 12,
			releaseDate: new Date('2001-12-21'),
			releaseYear: 2001,
			duration: 135,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/zwzWCmH72OSC9NA0lXRSplbT9vk.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/hCXdZPXkXUyslCxdwkUpf7rNGQV.jpg',
			countries: ['US'],
			genres: ['Biography', 'Drama'],
			actors: ['Russell Crowe'],
		},
		{
			title: 'Deadpool',
			description:
				'A wisecracking mercenary gains powers and seeks revenge.',
			ageLimit: 16,
			releaseDate: new Date('2016-02-12'),
			releaseYear: 2016,
			duration: 108,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/yGSxMiF0cYuAiyuve5DA6bnWEOh.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/fSRb7vyIP8OZlf0jRJoCicGRcT2.jpg',
			countries: ['US'],
			genres: ['Action', 'Comedy'],
			actors: ['Ryan Reynolds'],
		},
		{
			title: 'The Truman Show',
			description:
				'A man discovers his entire life is a reality TV show.',
			ageLimit: 10,
			releaseDate: new Date('1998-06-05'),
			releaseYear: 1998,
			duration: 103,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/yE5d3BUhE8hCnkMUJOo1QDoOGNz.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/1QugEuP57GxkWklK3QOTOz80Lup.jpg',
			countries: ['US'],
			genres: ['Comedy', 'Drama', 'Science Fiction'],
			actors: ['Jim Carrey'],
		},
		{
			title: 'Whiplash',
			description: 'A young drummer faces a ruthless music instructor.',
			ageLimit: 13,
			releaseDate: new Date('2014-10-10'),
			releaseYear: 2014,
			duration: 107,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/7fn624j5ljnQPWSNXXoaPEdfbwA.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/xrS2pWMivfsgx4F0UzakviVTviZ.jpg',
			countries: ['US'],
			genres: ['Drama', 'Musical'],
			actors: [],
		},
		{
			title: 'The Social Network',
			description:
				'The story of Facebook’s creation and the battles that followed.',
			ageLimit: 13,
			releaseDate: new Date('2010-10-01'),
			releaseYear: 2010,
			duration: 120,
			cardImgUrl:
				'https://image.tmdb.org/t/p/w300/n0ybibhJfja4PKRcQZ499kuv5yi.jpg',
			videoUrl: videoPlaceholder,
			trailerUrl: videoPlaceholder,
			posterUrl:
				'https://image.tmdb.org/t/p/w1280/4xnA6hV4sc7j4jdTo3Qa8HeLXnS.jpg',
			countries: ['US'],
			genres: ['Biography', 'Drama'],
			actors: [],
		},
	];

	const countries = await prisma.country.findMany();
	const genres = await prisma.genre.findMany();
	const actors = await prisma.actor.findMany();

	for (const movie of movies) {
		await prisma.movie.upsert({
			where: { title: movie.title },
			update: {
				posterUrl: movie.posterUrl,
			},
			create: {
				title: movie.title,
				description: movie.description,
				ageLimit: movie.ageLimit,
				releaseDate: movie.releaseDate,
				releaseYear: movie.releaseYear,
				duration: movie.duration,
				cardImgUrl: movie.cardImgUrl,
				videoUrl: movie.videoUrl,
				trailerUrl: movie.trailerUrl,
				posterUrl: movie.posterUrl,
				countries: {
					create: movie.countries.map((code) => {
						const country = countries.find((c) => c.code === code);

						if (!country)
							throw new Error(`Country ${code} not found`);

						return {
							country: { connect: { code } },
						};
					}),
				},
				genres: {
					create: movie.genres.map((name) => {
						const genre = genres.find((g) => g.name === name);
						if (!genre) throw new Error(`Genre ${name} not found`);
						return {
							genre: { connect: { id: genre.id } },
						};
					}),
				},
				// actors: {
				// 	create: movie.actors.map((actorFullName) => {
				// 		const [firstName, lastName] = actorFullName.split(' ');
				// 		const actor = actors.find(
				// 			(a) => a.firstName === firstName,
				// 		);
				// 		if (!actor)
				// 			throw new Error(`Actor ${actorFullName} not found`);
				// 		return {
				// 			actor: { connect: { id: actor.id } },
				// 		};
				// 	}),
				// },
			},
		});
	}

	console.log('Таблица фильмов успешно заполнена!');
}

async function seedReviews() {
	const array = Array.from({ length: 100 }, (_, index) => index + 1);

	for (const index of array) {
		await prisma.review.upsert({
			where: {
				id: index,
			},
			update: {},
			create: {
				message:
					'Задача организации, в особенности же рамки и место обучения кадров обеспечивает актуальность всесторонне сбалансированных нововведений. Практический опыт показывает, что сложившаяся структура организации способствует подготовке и реализации новых предложений? Разнообразный и богатый опыт постоянный количественный рост и сфера нашей активности способствует подготовке и реализации дальнейших направлений развитая системы массового участия.',
				rating: 7.5,
				movieId: 1,
				userId: index,
			},
		});
	}

	console.log('Таблица отзывов успешно заполнена!');
}

async function seedData() {
	await seedActors()
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});

	await seedCountries()
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});

	await seedRoles()
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});

	await seedUsers()
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});

	await seedGenres()
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});

	await seedMovies()
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});

	await seedReviews()
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});
}

seedData();
