import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean } from "class-validator"

export class WishedMovieResponse {
    @ApiProperty({
        example: 1
    })
    id: number

    @ApiProperty({
        example: 'Матрица'
    })
    title: string
}

export class ToggleWishedDto {
    @ApiProperty({
        example: true
    })
    @IsBoolean()
    isWished: boolean
}