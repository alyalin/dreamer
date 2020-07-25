import { IsString, MinLength } from 'class-validator';

export class ConfirmEmailDto {
  @IsString()
  @MinLength(32)
  hash: string;
}
