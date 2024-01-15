import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

export interface JWTUserDetails {
    email: string;
    name: string;
    publicId: string;
}

class JWTService {
    privateKey: string;
    publicKey: string;
    constructor(privateKeyFilePath: string, publicKeyFilePath: string) {
        this.privateKey = fs.readFileSync(privateKeyFilePath, 'utf8');
        this.publicKey = fs.readFileSync(publicKeyFilePath, 'utf8');
    }

    public sign = (userDetails: JWTUserDetails, expiresIn: number) => {
        return jwt.sign(userDetails, this.privateKey, {
            algorithm: 'RS256',
            expiresIn,
        });
    };

    public verify = (token: string) => {
        try {
            const decoded = jwt.verify(token, this.publicKey) as JWTUserDetails;
            return decoded;
        } catch (err) {
            return null;
        }
    };

    public middleware = (req: Request, res: Response, next: NextFunction) => {
        if (!req.path.includes('/protected')) {
            return next();
        }

        const token = req.headers['x-access-token'] as string;
        if (!token) {
            return res.status(401).send({
                message: 'No token provided',
            });
        }

        const decoded = this.verify(token);
        if (!decoded) {
            return res.status(401).send({
                message: 'Invalid token',
            });
        }

        req.user = decoded;
        next();
    };
}

export default JWTService;
