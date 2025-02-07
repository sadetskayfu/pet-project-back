import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserRoleBodyDto {
    @ApiProperty({
        required: true,
        description: 'Электронная почта пользователя',
        example: 'goblin_1444@mail.ru'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
        required: true,
        description: 'Название роли',
        example: 'admin'
    })
    @IsNotEmpty()
    @IsString()
    role: string
}