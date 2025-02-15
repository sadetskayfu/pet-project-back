import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

export class SendCodeDto {
    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty({
        required: false,
        default: 'mail',
        enum: ['mail', 'phone']
    })
    @IsIn(['mail', 'phone'])
    @IsOptional()
    confirmationType: 'mail' | 'phone'
}

export class SendAuthCodeDto extends SendCodeDto {
    @ApiProperty()
    @IsInt()
    @Min(1)
    userId: number
}

export class CodeConfirmationsDto {
    @ApiProperty()
    @Length(6, 6)
    @IsNotEmpty()
    @IsString()
    code: string

    @ApiProperty()
    @IsNumber()
    @Min(1)
    confirmationSessionId: number
}

export class SendCodeResponse {
    @ApiProperty({
        example: 1,
        description: 'Confirmation session ID'
    })
    id: number

    @ApiProperty({
        example: 1000,
        description: 'Code validity time (ms)'
    })
    timeValid: number
}