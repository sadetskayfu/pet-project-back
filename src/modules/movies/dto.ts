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
import { ActorForMovieResponse } from 'src/modules/actors/dto';
import { CountryResponse } from 'src/modules/countries/dto';
import { IsValidCountry } from 'src/decorators/valid-country.decorator';
import { GenreResponse } from 'src/modules/genres/dto';

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
        type: CountryResponse
    })
    country: CountryResponse

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
    isAddedToWishlist: boolean

    @ApiProperty({
        example: false
    })
    isRated: boolean
}

export class MovieResponse extends MovieForCardResponse {
    @ApiProperty({
        type: [ActorForMovieResponse]
    })
    actors: ActorForMovieResponse[]

    @ApiProperty({
        example: 'Description...'
    })
    description: string

    @ApiProperty({
        example: 18
    })
    ageLimit: number

    @ApiProperty({
        example: '2023-03-23T00:00:00.000Z'
    })
    releaseData: Date
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

export class DeleteMovieResponse {
    @ApiProperty({
        example: 1
    })
    id: number
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

	@ApiProperty()
	@IsInt()
	duration: number;

	@ApiProperty({
		example: [1, 2],
	})
	@IsArray()
	@IsNotEmpty({ each: true })
	genreIds: number[];

    @ApiProperty({
        example: [1, 2]
    })
    @IsArray()
    @IsNotEmpty({each: true})
    actorIds: number[]
}

export class UpdateMovieDto extends CreateMovieDto {
    @ApiProperty()
    @Min(1)
    @IsInt()
    id: number
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
    @Min(0)
    @Max(10)
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
        default: 40,
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