import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class GenreResponse {
    @ApiProperty({
        example: 1
    })
    id: number

    @ApiProperty({
        example: 'fantasy'
    })
    name: string
}

export class CreateGenreDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    name: string
}

