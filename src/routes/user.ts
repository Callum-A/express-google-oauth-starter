import { Router, Request, Response } from 'express';
import RouteHandler from './base';
import UserRepository from '../repositories/user';
import OAuthService from '../services/oauth';
import jwt from 'jsonwebtoken';
import JWTService from '../services/jwt';

interface GoogleOAuthRequest extends Request {
    query: {
        code: string;
    };
}

interface GoogleUserDetails {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    locale: string;
    iat: number;
    exp: number;
}

class UserRoutesHandler implements RouteHandler {
    userRepository: UserRepository;
    oAuthService: OAuthService;
    jwtService: JWTService;

    constructor(
        userRepository: UserRepository,
        oAuthService: OAuthService,
        jwtService: JWTService
    ) {
        this.userRepository = userRepository;
        this.oAuthService = oAuthService;
        this.jwtService = jwtService;
    }

    async googleOAuth(req: GoogleOAuthRequest, res: Response) {
        // Get code from query string
        const code = req.query.code;

        const { id_token } = await this.oAuthService.getGoogleOAuthTokens(code);
        const userDetails = jwt.decode(id_token) as GoogleUserDetails;
        let user = await this.userRepository.findByEmail(userDetails.email);
        if (!user) {
            user = await this.userRepository.createUser(
                userDetails.name,
                userDetails.email,
                'google'
            );
        }

        const accessToken = this.jwtService.sign(
            {
                email: user.email,
                name: user.name,
                publicId: user.publicId,
            },
            3600 // an hour
        );
        const refreshToken = this.jwtService.sign(
            {
                email: user.email,
                name: user.name,
                publicId: user.publicId,
            },
            3600 * 24 // a day
        );
        res.status(200).json({ accessToken, refreshToken, user });
    }

    async getUserByPublicId(req: Request, res: Response) {
        const publicId = req.params.publicId;

        const user = await this.userRepository.findByPublicId(publicId);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        res.send(user);
    }

    async whoAmI(req: Request, res: Response) {
        if (!req.user) {
            // Unreachable code
            res.status(401).send('Unauthorized');
            return;
        }

        const user = await this.userRepository.findByPublicId(
            req.user.publicId
        );
        if (!user) {
            // Unreachable code
            res.status(401).send('Unauthorized');
            return;
        }

        res.send(user);
    }

    getRouter(): Router {
        const router = Router();
        router.get('/:publicId', this.getUserByPublicId.bind(this));
        router.get('/oauth/google', this.googleOAuth.bind(this));
        router.get('/protected/whoami', this.whoAmI.bind(this));
        return router;
    }
}

export default UserRoutesHandler;
