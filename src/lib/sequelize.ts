import { Sequelize } from 'sequelize';
import logger from '@/lib/logger';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    logger.info('[Database] Connection has been established successfully.');
  })
  .catch((error) => {
    logger.error(`[Database] Unable to connect to the database: ${error}`);
  });

export default sequelize;
