import BaseModel from './base';

class User implements BaseModel {
    id: number;
    publicId: string; // UUID
    name: string;
    email: string;

    constructor(id: number, publicId: string, name: string, email: string) {
        this.id = id;
        this.publicId = publicId;
        this.name = name;
        this.email = email;
    }
}

export default User;
