import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  nodeenv: process.env.NODE_ENV,
}));
