import { Router, Request, Response } from 'express';
import RouteHandler from './base';

class RootHandler implements RouteHandler {
    root(_req: Request, res: Response) {
        res.send('Hello World!');
    }

    getRouter(): Router {
        const router = Router();
        router.get('/', this.root);
        return router;
    }
}

export default RootHandler;
