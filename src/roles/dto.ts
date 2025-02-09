import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserRoleBodyDto {
    @ApiProperty({
        example: 'goblin_1444@mail.ru'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
        example: 'admin'
    })
    @IsNotEmpty()
    @IsString()
    role: string
}