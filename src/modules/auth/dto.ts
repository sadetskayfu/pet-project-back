import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { IsValidCountry } from 'src/decorators/valid-country.decorator';
import { IsValidPassword } from 'src/decorators/valid-password.decorator';
import { Role } from 'src/modules/roles/types';

export class SignInDto {
	@ApiProperty()
    @IsEmail()
	email: string;

	@ApiProperty()
	@IsValidPassword()
	password: string;
}

export class SignUpDto extends SignInDto {
	@ApiProperty()
	@IsValidCountry()
	country: string;
}

export class SessionInfoDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    email: string

	@ApiProperty()
	roles: Role[]

    @ApiProperty()
    iat: number

    @ApiProperty()
    exp: number
}

