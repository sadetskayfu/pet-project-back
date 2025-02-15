import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

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
    name: string
}

export class UpdateGenreDto extends CreateGenreDto {
    @ApiProperty()
    @Min(1)
    @IsNumber()
    id: number
}
