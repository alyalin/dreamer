import { Logger, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import * as ormConnection from './ormconfig'
import { ConfigModule } from '@nestjs/config'
import { Connection } from 'typeorm'
import { UserEntity } from './modules/user/entities/user.entity'
import { USER_ROLES } from './modules/user/enums/roles.enum'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => (ormConnection),
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {
    this.addAdminUser();
  }

  async addAdminUser() {
    try {
      const userRepository = this.connection.getRepository(UserEntity);
      const isExist = await userRepository.findOne({ where: { email: 'master@justadreamer.ru' } });
      if (!isExist) {
        const user = userRepository.create({
          email: 'master@justadreamer.ru',
          password: 'TaX6jUfF',
          role: USER_ROLES.ADMIN
        });
        await userRepository.save(user);
        Logger.log('Admin user added', 'Bootstrap');
      } else {
        Logger.log('Admin user already exists', 'Bootstrap')
      }
    } catch (e) {
      Logger.warn(e, 'Bootstrap')
    }
  }
}
