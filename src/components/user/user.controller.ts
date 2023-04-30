import bcrypt from "bcrypt";
import jwt from  "jsonwebtoken";
import { Request, Response } from 'express';

import { IUserController } from './interfaces/user-controller.interface';
import { UserService } from './user.service';
import { IStoreUserDTO } from './interfaces/store-user.interface';
import { IUpdateUserDTO } from './interfaces/update-user.interface';
import { IResponseJson } from '../base/interfaces/response-json.interface';
import { ILoginUserDTO } from "./interfaces/login-user.interface";

export class UserController extends UserService implements IUserController {
    
    constructor() {
        super();
    }

    public async createUser(req: Request, res: Response): Promise<void> {
        try {
            const user: IStoreUserDTO = req.body;

            if(user) {
                const emailExists: IResponseJson = await super.findExistingEmailUserService(user.email);
                
                if(emailExists.status && !emailExists.data) {
                    const result: IResponseJson = await super.createUserService(user);
        
                    if(result.status) {
                        res.status(200);
                        res.send("user successfully registered!");
                    } else {
                        res.status(400);
                        res.json(result?.message);
                    }
                } else if(emailExists.status && emailExists.data) {
                    res.status(400);
                    res.send("Email already registered!")
                    throw Error("Email already registered!");
                } else {
                    res.status(400);
                    res.send(emailExists?.message)
                }
            }
        } catch(error:any) {
            console.error(error);
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const id: number = Number(req.params.id);
            const userID: number = Number(req.headers['user-id']);
            const permission = super.compareParamIdAndHeaderID(userID, id);

            if(permission) {
                if(id) {
                    const idExists: IResponseJson = await super.findByIdUserService(id);
        
                    if(idExists.status && idExists.data) {
                        const result: IResponseJson = await super.deleteUserService(id);
                
                        if(result.status) {
                            res.status(200);
                            res.send("'User deleted successfully!");
                        } else {
                            res.status(400);
                            res.json(result?.message);
                        }
                    } else if(idExists.status && !idExists.data) {
                        res.status(404);
                        res.send("User not found!")
                        throw Error("User not found!") 
                    } else {
                        res.status(400)
                        res.send(idExists?.message);
                    }
                }
            } else {
                res.status(401);
                res.json("Not authorized!");
                throw Error("Not authorized!");
            }
        } catch(error: any) {
            console.error(error);
        }
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const id: number = Number(req.params.id);
            const userID: number = Number(req.headers['user-id']);
            const user: IUpdateUserDTO = {...req.body, id};
            const permission = super.compareParamIdAndHeaderID(userID, id);

            if(permission) {
                if(user) {
                    const idExists: IResponseJson = await super.findByIdUserService(user.id);
        
                    if(idExists.status && idExists.data) {
                       
                        const result: IResponseJson = await super.updateUserService(user);
            
                        if(result.status) {
                            res.status(200);
                            res.json({success:1});
                        } else {
                            res.status(400);
                            res.json(result?.message);
                        }
                    } else if(idExists.status && !idExists.data) {
                        res.status(404);
                        res.json("User not found!");
                        throw Error("User not found!") 
                    } else {
                        res.status(400);
                        res.json(idExists?.message);
                    }
                }
            } else {
                res.status(401);
                res.json("Not authorized!");
                throw Error("Not authorized!");
            }
        } catch (error: any) {
            console.error(error);
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password }: ILoginUserDTO = req.body;
            const user: IResponseJson = await super.findByEmailUserService(email);
    
            if(user.status && user.data) {
                const secret: string = process.env.SECRET ?? 'null';
                const result: any = await bcrypt.compare(password, user.data.password);
    
                if(result) {
                    const token: string = jwt.sign({id: user.data.id, email: user.data.email, role: user.data.role}, secret);
                    const saveToken: IResponseJson= await super.saveToken(token, user.data.id)

                    if(!saveToken.status) {
                        res.status(400);
                        res.send(saveToken?.message);
                        throw Error("Error saving token!");
                    }

                    res.json({token: token, userID: user.data.id})
                } else {
                    res.status(406);
                    res.send("Invalid password!");
                    throw Error("Invalid password!");
                }
            } else if(user.status && !user.data) {
                res.status(404);
                res.json("User not found!");
                throw Error("User not found!") 
            } else {
                res.status(400);
                res.send(user?.message)
            }
        } catch (error: any) {
            console.error(error);
        }
    }
}