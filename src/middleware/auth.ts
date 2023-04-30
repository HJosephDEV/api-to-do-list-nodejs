import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
 
export function Auth(req: Request, res: Response, next: NextFunction): void {
    try {
        const authToken: string | undefined = req.headers['authorization'];
        const authIdUser: string | undefined | Array<string> = req.headers['id-user'];

        if(authToken != undefined) {
            const bearer: Array<string> = authToken.split(' ');
            const token: string = bearer[1];
            const secret: string = process.env.SECRET ?? 'null';

            if(secret != null) jwt.verify(token, secret, (error: any, decoded: any): void => {
                if(error) {
                    res.status(401);
                    res.json("Not authorized!");
                    throw Error("Not authorized!");
                }

                if(decoded?.id == authIdUser) {
                    next();
                } else {
                    res.status(401);
                    res.json("Not authorized!");
                    throw Error("Not authorized!");
                }
            });
         } else {
            res.status(401);
            res.json("Token was not provided!");
            throw Error("Token was not provided!");
         }
    } catch(error:any) {
        console.error(error);
    }
}
