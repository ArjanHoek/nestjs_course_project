import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => {
  const { DB_PASS, DB_USER, DB_HOST, DB_PORT, DB_NAME, NODE_ENV } = process.env;
  return {
    type: 'postgres',
    host: DB_HOST,
    port: +DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    synchronize: false,
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    migrations: [`${__dirname}/../../migrations/*{.ts,.js}`],
    migrationsRun: NODE_ENV === 'test',
  };
});
