import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

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

export class GenreDto {
    @ApiProperty({
        example: 1
    })
    @ApiProperty()
    id: number

    @ApiProperty({
        example: 'action'
    })
    @ApiProperty()
    name: string
}