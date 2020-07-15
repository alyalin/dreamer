import { Logger, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import * as ormConnection from './ormconfig'
import { ConfigModule } from '@nestjs/config'
import { Connection } from 'typeorm'
import { UserEntity } from './modules/user/entities/user.entity'
import { USER_ROLES } from './modules/user/enums/roles.enum'
import { LinksModule } from './modules/links/links.module'
import { UserService } from './modules/user/user.service'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => (ormConnection),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    LinksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection, private userService: UserService) {
    this.addAdminUser()
  }

  async addAdminUser() {
    try {
      const userRepository = this.connection.getRepository(UserEntity);
      const isExist = await userRepository.findOne({ where: { email: 'master@justadreamer.ru' } });
      if (!isExist) {
        await this.userService.createUser({
          email: 'master@justadreamer.ru',
          password: 'TaX6jUfF',
          checkbox: false,
        }, USER_ROLES.ADMIN)
        Logger.log('Admin user added', 'Bootstrap')
      } else {
        Logger.log('Admin user already exists', 'Bootstrap')
      }
    } catch (e) {
      Logger.warn(e, 'Bootstrap')
    }
  }
}
