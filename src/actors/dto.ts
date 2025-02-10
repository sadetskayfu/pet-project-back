import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

export class PaginationMeta {
    @ApiProperty({
        example: 1
    })
    page: number

    @ApiProperty({
        example: 20
    })
    limit: number

    @ApiProperty({
        example: 160
    })
    total: number

    @ApiProperty({
        example: 8
    })
    totalPages: number
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
  
    @ApiProperty({ type: PaginationMeta})
    meta: PaginationMeta;
  }

export class CreateActorDto {
    @ApiProperty()
    @Length(1, 32)
    @IsNotEmpty()
    @IsString()
    fistName: string

    @ApiProperty()
    @Length(1, 32)
    @IsNotEmpty()
    @IsString()
    lastName: string

    @ApiProperty({
        example: '2010-07-16'
    })
    @Length(10, 10)
    @IsNotEmpty()
    @IsString()
    birthDate: string

    @ApiProperty({
        required: false
    })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    photoUrl?: string
}

export class UpdateActorDto extends CreateActorDto {
    @ApiProperty()
    @Min(1)
    @IsNumber()
    id: number
}