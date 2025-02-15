import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, Length } from "class-validator"

export class UpdateProfileDto {
    @ApiProperty({
        required: false
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Length(1, 32)
    firstName?: string

    @ApiProperty({
        required: false
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Length(1, 32)
    lastName?: string

    @ApiProperty({
        required: false,
        example: '2017-05-23'
    })
    @IsOptional()
    @IsDateString()
    @IsNotEmpty()
    birthDate?: string

    @ApiProperty({
        required: false, enum: ['man', 'woman']
    })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @IsIn(['man', 'woman'])
    gender?: 'man' | 'woman'
}