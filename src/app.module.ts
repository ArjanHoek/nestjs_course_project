import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
  imports: [
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        database: 'cars_dev',
        password: 'postgres',
        username: 'postgres',
        host: 'localhost',
        port: 5432,
        entities: [User, Report],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
