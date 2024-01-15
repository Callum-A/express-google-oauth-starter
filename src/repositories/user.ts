import DBConnector from '../database/base';
import User from '../model/user';
import { v4 as uuidv4 } from 'uuid';
import BaseRepository from './base';

class UserRepository implements BaseRepository<User> {
    db: DBConnector;
    constructor(db: DBConnector) {
        this.db = db;
    }

    async findById(id: number): Promise<User | null> {
        const user = await this.db.readOne('SELECT * FROM users WHERE id = ?', [
            id,
        ]);

        if (user === undefined) {
            return null;
        }

        return new User(user.id, user.publicId, user.name, user.email);
    }

    async findByPublicId(publicId: string): Promise<User | null> {
        const user = await this.db.readOne(
            'SELECT * FROM users WHERE publicId = ?',
            [publicId]
        );

        if (user === undefined) {
            return null;
        }

        return new User(user.id, user.publicId, user.name, user.email);
    }

    async findByEmail(emaiL: string): Promise<User | null> {
        const user = await this.db.readOne(
            'SELECT * FROM users WHERE email = ?',
            [emaiL]
        );

        if (user === undefined) {
            return null;
        }

        return new User(user.id, user.publicId, user.name, user.email);
    }

    async createUser(name: string, email: string): Promise<User> {
        const publicId = uuidv4();
        await this.db.write(
            'INSERT INTO users (name, publicId, email) VALUES (?, ?, ?)',
            [name, publicId, email]
        );

        const user = await this.findByPublicId(publicId);
        if (!user) {
            // Unreachable code
            throw new Error('User not found');
        }
        return user;
    }
}

export default UserRepository;
