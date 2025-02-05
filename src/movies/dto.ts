import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsDateString,
	IsIn,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
    Max,
    Min,
} from 'class-validator';
import { IsValidCountry } from 'src/decorators/valid-country.decorator';
import { Cursor } from './types';

export class CreateMovieDto {
    @ApiProperty({ required: true, description: 'Название фильма', example: 'Avatar' })
    @IsNotEmpty()
	@IsString()
	title: string;

	@ApiProperty({
        required: true,
        description: 'Дата релиза',
		example: '2010-07-16',
	})
	@IsDateString()
	@IsNotEmpty()
	releaseDate: string;

	@ApiProperty({
        required: true,
        description: 'Страна производства',
		example: 'US',
	})
	@IsValidCountry()
	countryCode: string;

	@ApiProperty({
        required: true,
        description: 'Длительность фильма',
		example: 148,
	})
	@IsInt()
	duration: number;

	@ApiProperty({
        required: true,
        description: 'Жанры фильма',
		example: [1, 2],
	})
	@IsArray()
	@IsNotEmpty({ each: true })
	genreIds: number[];
}

export class MovieFiltersDto {
    @ApiProperty({ required: false, description: 'Название фильма', example: 'Avatar' })
    @IsOptional()
    @IsString()
    title?: string;
  
    @ApiProperty({ required: false, description: 'Жанры (разделенные "+")', example: 'fantasy' })
    @IsOptional()
    @IsString()
    genres?: string;
  
    @ApiProperty({ required: false, description: 'Страны (разделенные "+")', example: 'US' })
    @IsOptional()
    @IsString()
    countries?: string;
  
    @ApiProperty({ required: false, description: 'Год выпуска', example: '2009' })
    @IsOptional()
    @IsInt()
    @Min(1900)
    @Type(() => Number)
    year?: number;
  
    @ApiProperty({ required: false, description: 'Минимальный рейтинг', example: '9' })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(10)
    @Type(() => Number)
    rating?: number;
  
    @ApiProperty({ required: false, description: 'Курсор для пагинации' })
    @IsOptional()
    cursor?: Cursor;
  
    @ApiProperty({ required: false, description: 'Количество элементов на странице', default: 40 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    pageSize: number = 40;
  
    @ApiProperty({ required: false, description: 'Поле для сортировки', enum: ['averageRating', 'releaseYear'] })
    @IsOptional()
    @IsIn(['averageRating', 'releaseYear'])
    sortedBy?: 'averageRating' | 'releaseYear';
  }