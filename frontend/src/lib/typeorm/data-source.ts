import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User, Booth, PhotoSession, Booking, Device, Template } from './entities';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  database: process.env.DB_NAME || 'photobooth_db',
  synchronize: process.env.NODE_ENV === 'development', // Auto synchronize schema in local dev
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [User, Booth, PhotoSession, Booking, Device, Template],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  subscribers: [],
};

// Singleton instance for TypeORM connection management
export const AppDataSource = new DataSource(dataSourceOptions);

let isInitialized = false;

export async function getDatabaseConnection(): Promise<DataSource> {
  if (!isInitialized) {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    isInitialized = true;
  }
  return AppDataSource;
}

export default AppDataSource;
