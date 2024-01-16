import BaseModel from './base';

export type AuthProvider = 'google';

class User implements BaseModel {
    id: number;
    publicId: string; // UUID
    name: string;
    email: string;
    authProvider: AuthProvider;

    constructor(
        id: number,
        publicId: string,
        name: string,
        email: string,
        authProvider: AuthProvider
    ) {
        this.id = id;
        this.publicId = publicId;
        this.name = name;
        this.email = email;
        this.authProvider = authProvider;
    }
}

export default User;
