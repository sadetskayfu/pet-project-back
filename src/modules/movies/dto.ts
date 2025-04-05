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
import { CountryResponse } from 'src/modules/countries/dto';
import { IsValidCountry } from 'src/decorators/valid-country.decorator';
import { GenreResponse } from 'src/modules/genres/dto';
import { ActorResponse } from '../actors/dto';

export class CursorResponse {
    @ApiProperty({
        example: 1
    })
    id: number

    @ApiProperty({
        example: 5
    })
    rating?: number

    @ApiProperty({
        example: 2014
    })
    releaseYear?: number
}

export class MovieForCard {
    id: number
    title: string
    duration: number
    countries: CountryResponse[]

    @ApiProperty({
        type: [GenreResponse]
    })
    genres: GenreResponse[]

    @ApiProperty({
        example: 5
    })
    rating: number

    @ApiProperty({
        example: 55
    })
    totalReviews: number

    @ApiProperty({
        example: 2014
    })
    releaseYear: number

    @ApiProperty({
        example: 'https://example.com/photo.jpg'
    })
    cardImgUrl: string
}

export class MovieForCardResponse {
    @ApiProperty({
        example: 1
    })
    id: number

    @ApiProperty({
        example: 'Avatar'
    })
    title: string

    @ApiProperty({
        example: 130
    })
    duration: number

    @ApiProperty({
        type: [CountryResponse]
    })
    countries: CountryResponse[]

    @ApiProperty({
        type: [GenreResponse]
    })
    genres: GenreResponse[]

    @ApiProperty({
        example: 5
    })
    rating: number

    @ApiProperty({
        example: 55
    })
    totalReviews: number

    @ApiProperty({
        example: 2014
    })
    releaseYear: number

    @ApiProperty({
        example: 'https://example.com/photo.jpg'
    })
    cardImgUrl: string

    @ApiProperty({
        example: false
    })
    isWatched: boolean

    @ApiProperty({
        example: false
    })
    isWished: boolean

    @ApiProperty({
        example: false
    })
    isRated: boolean

    @ApiProperty({
        example: 18
    })
    ageLimit: number
}

export class MovieResponse extends MovieForCardResponse {
    @ApiProperty({
        type: [ActorResponse]
    })
    actors: ActorResponse[]

    @ApiProperty({
        example: 'Description...'
    })
    description: string

    @ApiProperty({
        example: '2023-03-23T00:00:00.000Z'
    })
    releaseDate: Date

    @ApiProperty({
        example: 'https://example.com/photo.jpg'
    })
    videoUrl: string
}

export class GetMoviesResponse {
    @ApiProperty({
        type: [MovieForCardResponse]
    })
    data: MovieForCardResponse[]

    @ApiProperty({
        type: CursorResponse
    })
    nextCursor: CursorResponse | null
}

export class CreateMovieDto {
    @ApiProperty()
    @IsNotEmpty()
	@IsString()
	title: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string

    @ApiProperty()
    @IsInt()
    ageLimit: number

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    cardImgUrl: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    videoUrl: string

	@ApiProperty({
		example: '2010-07-16',
	})
	@IsDateString()
	@IsNotEmpty()
	releaseDate: string;

	@ApiProperty({
		example: ['US'],
	})
	@IsValidCountry()
	countries: string[];

	@ApiProperty()
	@IsInt()
	duration: number;

	@ApiProperty({
		example: [1, 2],
	})
	@IsArray()
	@IsNotEmpty({ each: true })
	genres: number[];

    @ApiProperty({
        example: [1, 2]
    })
    @IsArray()
    @IsNotEmpty({each: true})
    actors: number[]
}

export class PaginationDto {
    @ApiProperty({
        required: false
    })
    @Min(1)
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    cursorId?: number

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @Min(5)
    @Max(9)
    @IsInt()
    @Type(() => Number)
    cursorRating?: number

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @Min(1900)
    @Max(new Date().getFullYear())
    @Type(() => Number)
    cursorReleaseYear?: number

    @ApiProperty({
        default: 20,
        required: false
    })
    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    limit?: number
}

export class SortingDto {
    @ApiProperty({ required: false, enum: ['rating', 'releaseYear'] })
    @IsOptional()
    @IsIn(['rating', 'releaseYear'])
    sort?: 'rating' | 'releaseYear';

    @ApiProperty({
        required: false,
        default: 'desc',
        enum: ['desc', 'asc']
    })
    @IsOptional()
    @IsIn(['desc', 'asc'])
    order?: 'desc' | 'asc'
}

export class FilterDto {
    @ApiProperty({ required: false})
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    title?: string;
  
    @ApiProperty({ required: false, description: 'Жанры (разделенные "+")', example: 'fantasy+action' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    genres?: string;
  
    @ApiProperty({ required: false, description: 'Страны (разделенные "+")', example: 'US+RU' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    countries?: string;
  
    @ApiProperty({ required: false, example: '2009' })
    @IsOptional()
    @IsInt()
    @Min(1900)
    @Max(new Date().getFullYear())
    @Type(() => Number)
    year?: number;
  
    @ApiProperty({ required: false, description: 'Минимальный рейтинг', example: '9' })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(10)
    @Type(() => Number)
    rating?: number;
}

export class UpdateMovieRatingResponse {
    @ApiProperty({
        example: 1
    })
    id: number

    @ApiProperty({
        example: 'Matrix'
    })
    title: string

    @ApiProperty({
        example: 5.5
    })
    rating: number

    @ApiProperty({
        example: 15
    })
    totalReviews: number
}