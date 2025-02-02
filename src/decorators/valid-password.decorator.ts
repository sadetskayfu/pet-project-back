import { applyDecorators } from '@nestjs/common';
import { Length, Matches, IsNotEmpty } from 'class-validator';

export function IsValidPassword() {
	return applyDecorators(
		IsNotEmpty({ message: 'The password must not be empty.' }),
		Length(6, 15, {
			message:
				'The password must be at least 6 characters, and no more than 15',
		}),
		Matches(/[A-Z]/, {
			message: 'The password must contain at least one uppercase letter.',
		}),
		Matches(/^[A-Za-z0-9]+$/, {
			message: 'The password must consist of only letters and numbers.',
		}),
	);
}
