import { ApiProperty } from "@nestjs/swagger"

export class CountryDto {
    @ApiProperty({
        example: 'BY'
    })
    code: string

    @ApiProperty({
        example: 'Belarus'
    })
    name: string
}