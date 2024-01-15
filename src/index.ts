import express, { Express } from 'express';
import SqliteDBConnector from './database/sqlite';
import RootHandler from './routes/root';
import dotenv from 'dotenv';
import UserRepository from './repositories/user';
import UserRoutesHandler from './routes/user';
import OAuthService from './services/oauth';
import JWTService from './services/jwt';

const main = async () => {
    dotenv.config();

    const ROOT_HANDLER = new RootHandler();
    const DATABASE = new SqliteDBConnector(process.env.DB_PATH || ':memory:');
    await DATABASE.connect();
    const USER_REPOSITORY = new UserRepository(DATABASE);
    const OAUTH_SERVICE = new OAuthService(
        process.env.GOOGLE_CLIENT_ID || '',
        process.env.GOOGLE_CLIENT_SECRET || '',
        process.env.GOOGLE_REDIRECT_URL || ''
    );
    const JWT_SERVICE = new JWTService(
        process.env.JWT_PRIVATE_KEY_FILE || '',
        process.env.JWT_PUBLIC_KEY_FILE || ''
    );
    const USER_HANDLER = new UserRoutesHandler(
        USER_REPOSITORY,
        OAUTH_SERVICE,
        JWT_SERVICE
    );
    await DATABASE.write(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, publicId TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL)'
    );
    await DATABASE.write(
        'CREATE UNIQUE INDEX IF NOT EXISTS publicIdIndex ON users (publicId)'
    );
    await DATABASE.write(
        'CREATE UNIQUE INDEX IF NOT EXISTS emailIndex ON users (email)'
    );

    const APP: Express = express();

    const PORT = process.env.PORT || 3000;

    APP.use(express.json());
    APP.all('*', JWT_SERVICE.middleware);
    APP.use('/', ROOT_HANDLER.getRouter());
    APP.use('/api/v1/users', USER_HANDLER.getRouter());

    APP.listen(PORT, () => {
        console.log(`[server]: Server is running at http://localhost:${PORT}`);
    });
};

main();
