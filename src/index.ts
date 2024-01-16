import express, { Express } from 'express';
import SqliteDBConnector from './database/sqlite';
import RootHandler from './routes/root';
import config from './utils/config';
import UserRepository from './repositories/user';
import UserRoutesHandler from './routes/user';
import OAuthService from './services/oauth';
import JWTService from './services/jwt';

const main = async () => {
    const ROOT_HANDLER = new RootHandler();
    const DATABASE = new SqliteDBConnector(config.db.path);
    await DATABASE.connect();
    const USER_REPOSITORY = new UserRepository(DATABASE);
    const OAUTH_SERVICE = new OAuthService(
        config.oauth.google.clientId,
        config.oauth.google.clientSecret,
        config.oauth.google.redirectUrl
    );
    const JWT_SERVICE = new JWTService(
        config.jwt.privateKeyFile,
        config.jwt.publicKeyFile
    );
    const USER_HANDLER = new UserRoutesHandler(
        USER_REPOSITORY,
        OAUTH_SERVICE,
        JWT_SERVICE
    );
    await DATABASE.write(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, publicId TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, authProvider TEXT NOT NULL)'
    );
    await DATABASE.write(
        'CREATE UNIQUE INDEX IF NOT EXISTS publicIdIndex ON users (publicId)'
    );
    await DATABASE.write(
        'CREATE UNIQUE INDEX IF NOT EXISTS emailIndex ON users (email)'
    );

    const APP: Express = express();
    APP.use(express.json());
    APP.all('*', JWT_SERVICE.middleware);
    APP.use('/', ROOT_HANDLER.getRouter());
    APP.use('/api/v1/users', USER_HANDLER.getRouter());

    APP.listen(config.port, () => {
        console.log(
            `[server]: Server is running at http://localhost:${config.port}`
        );
    });
};

main();
