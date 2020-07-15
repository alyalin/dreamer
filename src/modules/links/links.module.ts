import { Module } from '@nestjs/common'
import { LinksService } from './services/links/links.service'
import { UserModule } from '../user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/entities/user.entity'
import { LinksEntity } from './entities/links.entity'

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([LinksEntity, UserEntity])],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {
}
