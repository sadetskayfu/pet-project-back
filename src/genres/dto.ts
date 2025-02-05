import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateGenreBodyDto {
    @ApiProperty({
        example: 'action',
    })
    @IsNotEmpty()
    @IsString()
    name: string
}

export class UpdateGenreBodyDto {
    @ApiProperty({
        example: 'action',
    })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({
        example: 1,
    })
    @IsNotEmpty()
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