import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from "class-validator"
import { CountryResponse } from "../countries/dto"
import { UpdateReviewTotalCommentsResponse } from "../reviews/dto"

export class PaginationDto {
    @ApiProperty({
        required: false,
        default: 10
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

export class UpdateCommentDto {
    @ApiProperty()
    @Length(1, 1000)
    @IsNotEmpty()
    @IsString()
    message: string
}

export class CreateCommentDto extends UpdateCommentDto {
    @ApiProperty()
    @Min(1)
    @IsInt()
    reviewId: number
}

export class UserResponse {
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
        example: 15
    })
    totalReviews: number
}

export class CommentResponse {
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
    reviewId: number

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
        type: UserResponse
    })
    user: UserResponse
}

export class GetCommentsForReviewResponse {
    @ApiProperty({ type: [CommentResponse]})
    data: CommentResponse[];
  
    @ApiProperty({
        example: 15
    })
    nextCursor: number | null;
}

export class CreateCommentResponse extends CommentResponse {
    @ApiProperty({
        type: UpdateReviewTotalCommentsResponse
    })
    review: UpdateReviewTotalCommentsResponse
}

export class DeleteCommentResponse {
    @ApiProperty({
        example: 1
    })
    id: number

    @ApiProperty({
        type: UpdateReviewTotalCommentsResponse
    })
    review: UpdateReviewTotalCommentsResponse
}

export class UpdateCommentResponse {
    @ApiProperty({
        example: 1
    })
    id: number

    @ApiProperty({
        example: true
    })
    isChanged: boolean

    @ApiProperty({
        example: 'Cool review!'
    })
    message: string
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