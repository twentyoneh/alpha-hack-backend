import dotenv from 'dotenv';

dotenv.config();

interface Config {
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiration: string;
  };
  server: {
    port: number;
    nodeEnv: string;
  };
  logging: {
    level: string;
  };
}

export const config: Config = {
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key',
    expiration: process.env.JWT_EXPIRATION || '1h',
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
