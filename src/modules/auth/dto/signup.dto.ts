import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserEmailPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
