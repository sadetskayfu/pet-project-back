import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { IsHalfStep } from "src/decorators/isHalfStep.decorator";
import { CountryResponse } from "../countries/dto";
import { UpdateMovieRatingResponse } from "../movies/dto";

export class ReviewCursorResponse {
    @ApiProperty({
        example: 1
    })
    id: number

    @ApiProperty({
        example: 15
    })
    totalLikes?: number

    @ApiProperty({
        example: 15
    })
    totalDislikes?: number
}

export class ReviewFilterDto {
    @ApiProperty({ required: false})
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    meLiked?: boolean

    @ApiProperty({ required: false})
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    meDisliked?: boolean

    @ApiProperty({ required: false})
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    meCommented?: boolean
}

export class ReviewSortingDto {
    @ApiProperty({ required: false, enum: ['likes', 'dislikes'] })
    @IsOptional()
    @IsIn(['likes', 'dislikes'])
    sort?: 'likes' | 'dislikes';

    @ApiProperty({
        required: false,
        default: 'desc',
        enum: ['desc', 'asc']
    })
    @IsOptional()
    @IsIn(['desc', 'asc'])
    order?: 'desc' | 'asc'
}

export class ReviewPaginationDto {
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
    @IsInt()
    @Type(() => Number)
    cursorTotalLikes?: number

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    cursorTotalDislikes?: number

    @ApiProperty({
        default: 10,
        required: false
    })
    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    limit?: number
}

export class UpdateReviewDto {
    @ApiProperty()
    @Length(1, 1000)
    @IsString()
    @IsNotEmpty()
    message: string

    @ApiProperty({
        example: 4.5
    })
    @IsHalfStep({
        message: 'Rating must be a number with a step of 0.5'
    })
    @Min(0.5)
    @Max(10)
    @IsNumber()
    rating: number
}

export class CreateReviewDto extends UpdateReviewDto {
    @ApiProperty()
    @Min(1)
    @IsInt()
    movieId: number
}

export class ReviewUserResponse {
    @ApiProperty({
        example: 1
    })
    id: number

    @ApiProperty({
        type: CountryResponse
    })
    country: CountryResponse

    @ApiProperty()
    displayName: string | null

    @ApiProperty({
        example: 'goblin_1444@mail.ru'
    })
    email: string

    @ApiProperty()
    avatarUrl: string | null

    @ApiProperty({
        example: 25
    })
    totalReviews: number
}

export class ReviewCardForMovieResponse {
    @ApiProperty({
        example: 1
    })
    id: number

    @ApiProperty({
        example: 'This movie perfect! 10/10'
    })
    message: string
    @ApiProperty({
        example: '2023-03-23T00:00:00.000Z'
    })
    createdAt: Date

    @ApiProperty({
        example: 10
    })
    rating: number

    @ApiProperty({
        example: 1
    })
    userId: number

    @ApiProperty({
        example: 1
    })
    totalLikes: number

    @ApiProperty({
        type: ReviewUserResponse
    })
    user: ReviewUserResponse
}

export class ReviewCardResponse extends ReviewCardForMovieResponse {
    @ApiProperty({
        example: 'Matrix'
    })
    movieTitle: string
}

export class ReviewResponse extends ReviewCardForMovieResponse {
    @ApiProperty({
        example: false
    })
    isChanged: boolean

    @ApiProperty({
        example: 1
    })
    movieId: number

    @ApiProperty({
        example: 10
    })
    totalComments: number

    @ApiProperty({
        example: 15
    })
    totalLikes: number

    @ApiProperty({
        example: 15
    })
    totalDislikes: number

    @ApiProperty({
        example: false
    })
    isLiked: boolean

    @ApiProperty({
        example: false
    })
    isDisliked: boolean

    @ApiProperty({
        example: false
    })
    isCommented: boolean
}

export class GetReviewsForMovieResponse {
    @ApiProperty({ type: [ReviewResponse]})
    data: ReviewResponse[];
  
    @ApiProperty({
        type: ReviewCursorResponse
    })
    nextCursor: ReviewCursorResponse | null;
}

class DeleteReviewUserResponse {
    @ApiProperty({
        example: 15
    })
    totalReviews: number
}

export class DeleteReviewResponse {
    @ApiProperty({
        example: 1
    })
    id: number

    @ApiProperty({
        type: UpdateMovieRatingResponse
    })
    movie: UpdateMovieRatingResponse

    @ApiProperty({
        type: DeleteReviewUserResponse
    })
    user: DeleteReviewUserResponse
}

export class CreateReviewResponse extends ReviewResponse{
    @ApiProperty({
        type: UpdateMovieRatingResponse
    })
    movie: UpdateMovieRatingResponse
}

export class UpdateReviewResponse {
    @ApiProperty({
        example: 1
    })
    id: number

    @ApiProperty({
        example: true
    })
    isChanged: boolean

    @ApiProperty({
        example: 4.5
    })
    rating: number

    @ApiProperty({
        example: 'Cool movie!'
    })
    message: string

    @ApiProperty({
        type: UpdateMovieRatingResponse
    })
    movie: UpdateMovieRatingResponse
}

export class UpdateReviewTotalCommentsResponse {
    @ApiProperty({
        example: 1
    })
    id: number

    @ApiProperty({
        example: 15
    })
    totalComments: number
}

export class ToggleLikeDto {
    @ApiProperty({
        example: true
    })
    @IsBoolean()
    isLiked: boolean
}

export class ToggleDislikeDto {
    @ApiProperty({
        example: true
    })
    @IsBoolean()
    isDisliked: boolean
}