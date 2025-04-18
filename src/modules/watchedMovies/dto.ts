import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean } from "class-validator"

export class WatchedMovieResponse {
    @ApiProperty({
        example: 1
    })
    id: number

    @ApiProperty({
        example: 'Матрица'
    })
    title: string
}

export class ToggleWatchedDto {
    @ApiProperty({
        example: true
    })
    @IsBoolean()
    isWatched: boolean
}