import { JWTUserDetails } from '../../services/jwt';

export {};

declare global {
    namespace Express {
        export interface Request {
            user: JWTUserDetails | null | undefined;
        }
    }
}
