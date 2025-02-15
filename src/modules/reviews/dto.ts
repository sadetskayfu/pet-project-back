import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { IsHalfStep } from "src/decorators/isHalfStep.decorator";

export class OrderDto {
    @ApiProperty({
        required: false,
        default: 'desc',
        enum: ['desc', 'asc']
    })
    @IsOptional()
    @IsIn(['desc', 'asc'])
    order?: 'desc' | 'asc'
}

export class PaginationDto {
    @ApiProperty({
        required: false,
        default: 20
    })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    limit?: number

    @ApiProperty({
        required: false,
    })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    cursor?: number
}

class BaseReview {
    @ApiProperty()
    @Length(1, 255)
    @IsNotEmpty()
    @IsString()
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

export class UpdateReviewDto extends BaseReview {
    @ApiProperty()
    @Min(1)
    @IsInt()
    reviewId: number
}

export class CreateReviewDto extends BaseReview {
    @ApiProperty()
    @Min(1)
    @IsInt()
    movieId: number
}

export class ReviewResponse {
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
        example: false
    })
    isChanged: boolean

    @ApiProperty({
        example: 1
    })
    userId: number

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
        example: false
    })
    isLiked: boolean
}

export class GetReviewsForMovieResponse {
    @ApiProperty({ type: [ReviewResponse]})
    data: ReviewResponse[];
  
    @ApiProperty({
        example: 15
    })
    nextCursor?: number | null;
}

export class DeletedReviewResponse {
    @ApiProperty({
        example: 1
    })
    id: number
}