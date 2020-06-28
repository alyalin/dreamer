import { IsNotEmpty, IsString } from 'class-validator'

export class SocialTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string
}
