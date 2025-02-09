import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class CountryService {
	private readonly logger = new Logger(CountryService.name);

	constructor(private db: DbService) {}

	async findByCode(code: string) {
		this.logger.log(`Finding country by code '${code}'`);

		const country = await this.db.country.findUnique({
			where: {
				code,
			},
		});

		this.logger.log(`Found country: ${JSON.stringify(country)}`);

        if(!country) {
            throw new NotFoundException(`Country with code '${code}' does not exist`)
        }

		return country;
	}

	async getAll() {
		this.logger.log(`Getting all countries`);

		const countries = await this.db.country.findMany();

		this.logger.log(`Resulting countries: ${JSON.stringify(countries)}`);

		return countries;
	}
}
