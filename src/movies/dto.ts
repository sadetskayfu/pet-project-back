import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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
import { IsHalfStep } from 'src/decorators/isHalfStep.decorator';

export class CreateMovieDto {
    @ApiProperty({example: 'Avatar' })
    @IsNotEmpty()
	@IsString()
	title: string;

	@ApiProperty({
		example: '2010-07-16',
	})
	@IsDateString()
	@IsNotEmpty()
	releaseDate: string;

	@ApiProperty({
		example: 'US',
	})
	@IsValidCountry()
	countryCode: string;

	@ApiProperty({
		example: 148,
	})
	@IsInt()
	duration: number;

	@ApiProperty({
		example: [1, 2],
	})
	@IsArray()
	@IsNotEmpty({ each: true })
	genreIds: number[];
}

export class Cursor {
    id: number
    rating: number
    releaseYear: number
}

export class FilterWithPaginationDto {
    @ApiProperty({ required: false})
    @IsOptional()
    @IsString()
    title?: string;
  
    @ApiProperty({ required: false, description: 'Жанры (разделенные "+")', example: 'fantasy+action' })
    @IsOptional()
    @IsString()
    genres?: string;
  
    @ApiProperty({ required: false, description: 'Страны (разделенные "+")', example: 'US+RU' })
    @IsOptional()
    @IsString()
    countries?: string;
  
    @ApiProperty({ required: false, example: '2009' })
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
  
    @ApiProperty({ required: false})
    @IsOptional()
    cursor?: Cursor;
  
    @ApiProperty({ required: false, default: 40 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    pageSize: number = 40;
  
    @ApiProperty({ required: false, enum: ['rating', 'releaseYear'] })
    @IsOptional()
    @IsIn(['rating', 'releaseYear'])
    sortedBy?: 'rating' | 'releaseYear';
  }