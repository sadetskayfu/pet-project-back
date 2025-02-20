import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

export class SendCodeDto {
    @ApiProperty({
        required: false,
        default: 'mail',
        description: `'mail' or 'phone'`
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
    confirmationSessionid: number

    @ApiProperty({
        example: 1000,
        description: 'Code validity time (ms)'
    })
    codeTimeValid: number
}