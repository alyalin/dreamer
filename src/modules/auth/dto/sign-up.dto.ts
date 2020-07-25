import { IsBoolean, IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { Errors } from '../../../constants';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, {message: Errors.WEAK_PASSWORD_ERROR})
  password: string;

  @IsBoolean()
  checkbox: boolean;
}
