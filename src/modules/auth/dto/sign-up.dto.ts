import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator'

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsBoolean()
  checkbox: boolean;
}
