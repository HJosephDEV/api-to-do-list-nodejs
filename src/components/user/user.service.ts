import bcrypt from 'bcrypt';

import { connect, executeQuery, disconnect } from '../../database/connection';
import { IUserService } from './interfaces/user-service.interface';
import { IUpdateUserDTO } from './interfaces/update-user.interface';
import { IStoreUserDTO } from './interfaces/store-user.interface';
import { IResponseJson } from '../base/interfaces/response-json.interface';

export class UserService implements IUserService {

    public async createUserService(userParams: IStoreUserDTO): Promise<IResponseJson> {
        try {
            const {name, password, email, role} = userParams;
            const connection: IResponseJson = await connect();

            if(connection.status) {
                const hash = await bcrypt.hash(password, 10);
                const queryResult: IResponseJson = await executeQuery(`INSERT INTO users (name, password, email, role) VALUES ('${name}', '${hash}', '${email}', ${role});`);
                                
                await disconnect();

               
               if(queryResult.status) return {status: true, data: null, message: 'User created successfully!'};
            }
            
            return {status: false, data: null};
        } catch(error: any){
            console.error(error);
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }

    public async findByIdUserService(id: number): Promise<IResponseJson> {
        try {
            const connection: IResponseJson = await connect();

            if(connection.status) {
                const queryResult: IResponseJson = await executeQuery(`SELECT id, name, email, role FROM users WHERE id=${id}`);
                                
                await disconnect();


                if(queryResult.status) return {status: true, data: queryResult.data.length > 0 ? { user: queryResult.data[0] }: null};
            }

            return {status: false, data: null};
        } catch(error: any) {
            console.error(error);
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }
    
    public async deleteUserService(id: number): Promise<IResponseJson> {
        try {
            const connection: IResponseJson = await connect();

            if(connection.status) {
                const queryResult: IResponseJson = await executeQuery(`DELETE FROM users WHERE id=${id}`);
                                
                await disconnect();


                if(queryResult.status) return {status: true, data: null, message: 'User deleted successfully!'}
            }
            
            return {status: false, data: null};
        } catch(error: any) {
            console.error(error);
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }

    public async updateUserService(userParams: IUpdateUserDTO): Promise<IResponseJson> {
        try {
            const { id, name, email } = userParams;
            const connection: IResponseJson = await connect();
            
            if(connection.status) {
               const queryResult: IResponseJson = await executeQuery(`UPDATE users SET name='${name}', email='${email}' WHERE id='${id}'`);
                               
               await disconnect();

               
               if(queryResult.status) return {status: true, data: null}
            }
        
            return {status: false, data: null};
        } catch(error: any) {
            console.error(error);
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }

    public async findByEmailUserService(email: string): Promise<IResponseJson> {
        try {
            const connection: IResponseJson = await connect();

            if(connection.status) {
                const queryResult: IResponseJson = await executeQuery(`SELECT id, name, email, password, role from users WHERE email='${email}'`);
                                
                await disconnect();


                if(queryResult.status) return {status: true, data: queryResult.data?.length > 0 ? queryResult.data[0] : null};
            }

            return {status: false, data: null};
        } catch (error) {
            console.error(error);
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }

    public async findExistingEmailUserService(email: string): Promise<IResponseJson> {
        try {
            const connection: IResponseJson = await connect();

            if(connection.status) {
                const queryResult: IResponseJson = await executeQuery(`SELECT email from users WHERE email='${email}'`);
                                
                await disconnect();


                if(queryResult.status) return {status: true, data: queryResult.data?.length > 0 ? queryResult.data[0] : null};
            }

            return {status: false, data: null};
        } catch(error: any) {
            console.error(error);
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }

    public async saveToken(token: string, user_id: number): Promise<IResponseJson> {
        try {
            const connection: IResponseJson = await connect();

            if(connection.status) {
                const deleteQueryResult: IResponseJson = await executeQuery(`DELETE FROM tokens WHERE user_id=${user_id};`);
                const insertQueryResult: IResponseJson = await executeQuery(`INSERT INTO tokens (token, user_id) VALUES ('${token}', ${user_id});`);
                                
                await disconnect();


                if(deleteQueryResult.status && insertQueryResult.status) return {status: true, data: 1};
            }

            return {status: true, data: null}
        } catch(error: any) {
            console.error(error);
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }

    public async checkToken(token: string, user_id: number): Promise<IResponseJson> {
        try {
            const connection: IResponseJson = await connect();

            if(connection.status) {
                const deleteQueryResult: IResponseJson = await executeQuery(`DELETE FROM tokens WHERE user_id=${user_id};`);
                const insertQueryResult: IResponseJson = await executeQuery(`INSERT INTO tokens (token, user_id) VALUES ('${token}', ${user_id});`);
                                
                await disconnect();


                if(deleteQueryResult.status && insertQueryResult.status) return {status: true, data: 1};
            }

            return {status: true, data: null}
        } catch(error: any) {
            console.error(error);
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }

    public compareParamIdAndHeaderID(headerID: number, userID: number): boolean {
        return headerID === userID
    }
}
