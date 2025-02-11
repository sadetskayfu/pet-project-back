import { Controller, Get } from '@nestjs/common';
import { CountryService } from './countries.service';
import {
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CountryResponse } from './dto';

@ApiTags('Countries')
@Controller('countries')
export class CountryController {
	constructor(private countryService: CountryService) {}

	@Get()
	@ApiOperation({ summary: 'Получить страны' })
    @ApiResponse({
        status: 200,
        type: [CountryResponse]
    })
	async getAllCountries(): Promise<CountryResponse[]> {
		return this.countryService.getAllCountries();
	}
}
