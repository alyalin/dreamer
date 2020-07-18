import { Match } from '../../../common/decorators/match.decorator';
import { IsString, Matches, MaxLength, Min, MinLength } from 'class-validator';
import { Errors } from '../../../constants';

export class ResetPasswordByEmailDto {
  @IsString()
  @MinLength(32)
  hash: string;

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
