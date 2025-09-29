declare module "swagger-ui-express" {
    import { RequestHandler } from "express";

    interface SwaggerUIOptions {
        explorer?: boolean;
        swaggerOptions?: Record<string, any>;
        customCss?: string;
        customJs?: string;
        customfavIcon?: string;
        swaggerUrl?: string;
    }

    export const serve: RequestHandler[];
    export function setup(swaggerDoc: any, options?: SwaggerUIOptions): RequestHandler;
}
