import { IResponseJson } from "../../base/interfaces/response-json.interface";
import { IStoreUserDTO } from "./store-user.interface";
import { IUpdateUserDTO } from './update-user.interface';

export interface IUserService {
    createUserService(userParams: IStoreUserDTO): Promise<IResponseJson>;
    findByIdUserService(id: number): Promise<IResponseJson>;
    deleteUserService(id: number): Promise<IResponseJson>;
    updateUserService(userParams: IUpdateUserDTO): Promise<IResponseJson>;
    findByEmailUserService(email: string): Promise<IResponseJson>;
    findExistingEmailUserService(email: string): Promise<IResponseJson>;
    compareParamIdAndHeaderID(headerID: number, userID: number): boolean
}