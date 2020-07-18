import { Match } from '../../../common/decorators/match.decorator';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Errors } from '../../../constants';

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, {message: Errors.WEAK_PASSWORD_ERROR})
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Match('password')
  confirmPassword: string;
}
