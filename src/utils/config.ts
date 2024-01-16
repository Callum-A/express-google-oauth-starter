import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: Number.parseInt(process.env.PORT || '3000'),
    db: {
        path: process.env.DB_PATH || ':memory:',
    },
    oauth: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            redirectUrl: process.env.GOOGLE_REDIRECT_URL || '',
        },
    },
    jwt: {
        privateKeyFile: process.env.JWT_PRIVATE_KEY_FILE || '',
        publicKeyFile: process.env.JWT_PUBLIC_KEY_FILE || '',
    },
};

export default config;
