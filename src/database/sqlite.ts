import DBConnector from './base';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

class SqliteDBConnector implements DBConnector {
    pathToDb: string;
    db: Database | null;
    constructor(pathToDb: string) {
        this.pathToDb = pathToDb;
        this.db = null;
    }

    async connect(): Promise<void> {
        this.db = await open({
            filename: this.pathToDb,
            driver: sqlite3.Database,
        });
    }

    async readOne(query: string, args: any[] = []): Promise<any> {
        if (this.db === null) {
            throw new Error('Database not connected');
        }

        return this.db.get(query, args);
    }

    async readMany(query: string, args: any[] = []): Promise<any[]> {
        if (this.db === null) {
            throw new Error('Database not connected');
        }

        return await this.db.all(query, args);
    }

    async write(query: string, args: any[] = []): Promise<void> {
        if (this.db === null) {
            throw new Error('Database not connected');
        }

        await this.db.run(query, args);
    }

    async disconnect(): Promise<void> {
        if (this.db === null) {
            throw new Error('Database not connected');
        }
        await this.db.close();
    }
}

export default SqliteDBConnector;
