import { Controller, Get } from '@nestjs/common';
import { CountryService } from './countries.service';
import {
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CountryDto } from './dto';

@ApiTags('Countries')
@Controller('countries')
export class CountryController {
	constructor(private countryService: CountryService) {}

	@Get()
	@ApiOperation({ summary: 'Получить страны' })
    @ApiResponse({
        status: 200,
        type: [CountryDto]
    })
	async getAll() {
		return this.countryService.getAll();
	}
}
