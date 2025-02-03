import { Request } from "express";

export function expressAuthentication(
    request: Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    return Promise.resolve();
}
