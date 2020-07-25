import { IsString } from 'class-validator';

export class ConfirmEmailGenerateDto {
  @IsString()
  osName: string

  @IsString()
  browserName: string;
}
