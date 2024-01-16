const SqliteDBConnector = require('../dist/database/sqlite').default;
const dotenv = require('dotenv');
dotenv.config()


const main = async () => {
    if (!process.env.DB_URI) {
        console.error('Please set the DB_PATH environment variable');
        process.exit(1);
    }

    const db = new SqliteDBConnector(process.env.DB_URI);
    await db.connect();
    
    await db.write(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, publicId TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, authProvider TEXT NOT NULL)'
    );
    await db.write(
        'CREATE UNIQUE INDEX IF NOT EXISTS publicIdIndex ON users (publicId)'
    );
    await db.write(
        'CREATE UNIQUE INDEX IF NOT EXISTS emailIndex ON users (email)'
    );
    console.log("Database created at", process.env.DB_URI);
}

main();