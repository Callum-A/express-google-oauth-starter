import { Router } from 'express';

interface RouteHandler {
    getRouter(): Router;
}

export default RouteHandler;
