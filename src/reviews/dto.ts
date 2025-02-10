import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { IsHalfStep } from "src/decorators/isHalfStep.decorator";

export class PaginationDto {
    @ApiProperty({
        required: false,
        default: 10
    })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    pageSize?: number

    @ApiProperty({
        required: false,
    })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    cursor?: number
}

class BaseBodyReview {
    @ApiProperty()
    @Length(1, 255)
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

export class UpdateReviewDto extends BaseBodyReview {
    @ApiProperty()
    @Min(1)
    @IsInt()
    reviewId: number
}

export class CreateReviewDto extends BaseBodyReview {
    @ApiProperty()
    @Min(1)
    @IsInt()
    userId: number

    @ApiProperty()
    @Min(1)
    @IsInt()
    movieId: number
}

export class ReviewDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    message: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty({
        example: 5
    })
    rating: number

    @ApiProperty()
    isChanged: boolean

    @ApiProperty()
    userId: number

    @ApiProperty()
    movieId: number

    @ApiProperty()
    totalComments: number

    @ApiProperty()
    totalLikes: number
}
