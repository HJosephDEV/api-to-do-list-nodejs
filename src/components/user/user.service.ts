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

    public async findAllUserService(): Promise<IResponseJson> {
        try {
            const connected: Boolean = await connect();

            if(connected) {
                const users = await executeQuery(`SELECT id, name, email, role from users`);
                return {status: true, data: users.data};
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
            const connection: IResponseJson = await connect();
            
            if(connection.status) {
               const queryResult: IResponseJson = await executeQuery(`UPDATE users SET name='${userParams.name}', email='${userParams.email}' WHERE id='${userParams.id}'`);
               
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
                const queryResult: IResponseJson = await executeQuery(`SELECT email, password, role from users WHERE email='${email}'`);

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
}
