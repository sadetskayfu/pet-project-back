import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from "class-validator"

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

class BaseComment {
    @ApiProperty()
    @Length(1, 255)
    @IsNotEmpty()
    @IsString()
    message: string
}

export class UpdateCommentDto extends BaseComment {
    @ApiProperty()
    @Min(1)
    @IsInt()
    commentId: number
}

export class CreateCommentDto extends BaseComment {
    @ApiProperty()
    @Min(1)
    @IsInt()
    reviewId: number
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
        example: false
    })
    isLiked: boolean
}

export class GetCommentsForReviewResponse {
    @ApiProperty({ type: [CommentResponse]})
    data: CommentResponse[];
  
    @ApiProperty({
        example: 15
    })
    nextCursor?: number | null;
}

export class DeletedCommentResponse {
    @ApiProperty({
        example: 1
    })
    id: number
}