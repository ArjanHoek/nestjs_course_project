import { config } from 'dotenv';
import { DataSource } from 'typeorm';

const nodeEnv = process.env.NODE_ENV;

if (!nodeEnv) {
  throw new Error('Environment not specified');
}

config({ path: `./.env.${nodeEnv}` });

const { DB_NAME, DB_PASS, DB_USER, DB_HOST, DB_PORT } = process.env;

// This data source is only used when running migrations manually
const dataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  synchronize: false,
  dropSchema: false,
  logging: false,
  entities: [`${__dirname}/src/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
});

export default dataSource;
