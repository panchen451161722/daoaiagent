declare module 'swagger-ui-express' {
    import { RequestHandler } from 'express';
    
    export const serve: RequestHandler[];
    export function setup(
        spec: any,
        opts?: any,
        customCss?: any,
        customfavIcon?: any,
        swaggerUrl?: any,
        customSiteTitle?: any,
        ...handlers: RequestHandler[]
    ): RequestHandler;
}
