import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from "class-validator";

export class PaginationDto {
    @ApiProperty({
        required: false,
        example: 20
    })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    limit?: number

    @ApiProperty({
        required: false,
        example: 5,
    })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    cursor?: number
}

export class ActorResponse {
    @ApiProperty({
        example: 1
    })
    id: number

    @ApiProperty({
        example: 'Leo'
    })
    firstName: string

    @ApiProperty({
        example: 'DiCaprio'
    })
    lastName: string 

    @ApiProperty({
        example: '2023-03-23T00:00:00.000Z'
    })
    birthDate: Date
    
    @ApiProperty({
        example: 'https://example.com/photo.jpg'
    })
    photoUrl?: string | null
}

export class GetAllActorsResponse {
    @ApiProperty({ type: [ActorResponse]})
    data: ActorResponse[];
  
    @ApiProperty({
        example: 2
    })
    nextCursor: number | null
  }

export class CreateActorDto {
    @ApiProperty()
    @Length(1, 50)
    @IsNotEmpty()
    @IsString()
    firstName: string

    @ApiProperty()
    @Length(1, 50)
    @IsNotEmpty()
    @IsString()
    lastName: string

    @ApiProperty({
        example: '2010-07-16'
    })
    @IsDateString()
    @IsNotEmpty()
    @IsString()
    birthDate: string

    @ApiProperty({
        required: false
    })
    @IsString()
    @IsOptional()
    photoUrl?: string
}
