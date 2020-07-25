import { IsEmail, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  osName: string

  @IsString()
  browserName: string;
}
