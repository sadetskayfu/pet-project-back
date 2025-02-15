import { ApiProperty } from "@nestjs/swagger"

export class CountryResponse {
    @ApiProperty({
        example: 'BY'
    })
    code: string

    @ApiProperty({
        example: 'Belarus'
    })
    name: string
}