import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', () => {
  const {
    DB_PASS,
    DB_USER,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    NODE_ENV,
    DATABASE_URL,
  } = process.env;
  const options: TypeOrmModuleOptions = {
    type: 'postgres',
    host: DB_HOST,
    port: +DB_PORT,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASS,
    url: DATABASE_URL,
    synchronize: false,
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    migrations: [`${__dirname}/../../migrations/*{.ts,.js}`],
    migrationsRun: NODE_ENV !== 'development',
    ssl: {
      rejectUnauthorized: false,
    },
  };

  return options;
});
