import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Match } from 'src/decorators/math.decorator';
import { IsValidCountry } from 'src/decorators/valid-country.decorator';
import { IsValidPassword } from 'src/decorators/valid-password.decorator';

export class SignUpBodyDto {
	@ApiProperty({
		example: 'goblin_1444@mail.ru',
	})
    @IsEmail()
	email: string;

	@ApiProperty({
		example: 'men123AAA',
	})
	@IsValidPassword()
	password: string;

	@ApiProperty({
		example: 'men123AAA',
	})
	@Match('password')
	confirmPassword: string;

	@ApiProperty({
		example: 'BY',
	})
	@IsValidCountry()
	country: string;
}

export class SignInBodyDto {
	@ApiProperty({
		example: 'goblin_1444@mail.ru',
	})
    @IsEmail()
	email: string;

	@ApiProperty({
		example: 'men123AAA',
	})
	@IsValidPassword()
	password: string;
}

export class SessionInfoDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    email: string

    @ApiProperty()
    iat: number

    @ApiProperty()
    exp: number
}