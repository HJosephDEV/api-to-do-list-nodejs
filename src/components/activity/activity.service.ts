import { connect, executeQuery, disconnect } from '../../database/connection';
import { IActivityService } from './interfaces/activity-service.interface';
import { IStoreActivityDTO } from './interfaces/store-activity.interface';
import { IResponseJson } from '../base/interfaces/response-json.interface';
import { IUpdateActivityDTO } from './interfaces/update-activity.interface';

export class ActivityService implements IActivityService {

    public async createActivityService(activityParams: IStoreActivityDTO): Promise<IResponseJson> {
        try {
            const {name, description, userID} = activityParams;
            const connection: IResponseJson = await connect();

            if(connection.status) {
                const queryResult: IResponseJson = await executeQuery(`INSERT INTO activities (name, description, user_id, created_at, updated_at) VALUES ('${name}', '${description}', ${userID}, NOW(), NULL);`);
               
               if(queryResult.status) return {status: true, data: null, message: 'Activity created successfully!'};
            }
            
            return {status: false, data: null};
        } catch(error: any){
            console.error(error);
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }

    public async findByIdActivityService(id: number): Promise<IResponseJson> {
        try {
            const connection: IResponseJson = await connect();

            if(connection.status) {
                const queryResult: IResponseJson = await executeQuery(`SELECT * FROM activities WHERE id=${id}`);

                if(queryResult.status) return {status: true, data: queryResult.data.length > 0 ? { activity: queryResult.data[0] }: null};
            }

            return {status: false, data: null};
        } catch(error: any) {
            console.error(error);
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }
    
    public async deleteActivityService(id: number): Promise<IResponseJson> {
        try {
            const connection: IResponseJson = await connect();
            
            if(connection.status) {
                const queryResult: IResponseJson = await executeQuery(`DELETE FROM activities WHERE id=${id}`);
                
                if(queryResult.status) return {status: true, data: null, message: 'Activity deleted successfully!'}
            }
            
            return {status: false, data: null};
        } catch(error: any) {
            console.error(error);
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }

    public async updateActivityService(activityParams: IUpdateActivityDTO): Promise<IResponseJson> {
        try {
            const { id, name, description } = activityParams;
            const activityExists: IResponseJson = await new ActivityService().findByIdActivityService(id);

            if(activityExists.status && activityExists.data) {
                const connected: Boolean = await connect();

                if(connected) {
                    const queryResult: IResponseJson = await executeQuery(`UPDATE activities SET name='${name}', description='${description}', updated_at=NOW() WHERE id=${id}`)

                    if(queryResult.status) return {status: true, data: null, message: 'Activity updated successfully!'}
                }
            }

            return {status: false, data: null};
        } catch(error: any) {
            console.error(error)
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }
    
    public async findPerPageActivityService(id: number, resultsPerPage: number, offset: number): Promise<IResponseJson> {
        try {
            const connected: Boolean = await connect();

            if(connected) {
                const activities: IResponseJson = await executeQuery(`SELECT * FROM activities WHERE user_id=${id} LIMIT ${resultsPerPage} OFFSET ${offset}`);
                return {status: true, data: activities.data};
            }
            
            return {status: false, data: null};
        } catch(error: any) {
            console.error(error);
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }

    public async findAlreadyPaginatedPagesActivityService(id: number, limit: number): Promise<IResponseJson> {
        try {
            const connected: Boolean = await connect();
            
            if(connected) {
                const activities: IResponseJson = await executeQuery(`SELECT * FROM activities WHERE user_id=${id} LIMIT ${limit}`);
                return {status: true, data: activities.data};
            }
            
            return {status: false, data: null};
        } catch(error: any) {
            console.error(error);
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }

    public async findQuantityActivityService(id: number): Promise<IResponseJson> {
        try {
            const connected: Boolean = await connect();
            
            if(connected) {
                const totalResults: IResponseJson = await executeQuery(`SELECT COUNT(*) as count FROM activities WHERE user_id=${id}`);
                return {status: true, data: totalResults.data[0].count};
            }
            
            return {status: false, data: null};
        } catch(error: any) {
            console.error(error);
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }


    public async findExistingNameActivityService(activityName: string, userID: number): Promise<IResponseJson> {
        try {
            const connection: IResponseJson = await connect();
    
            if(connection.status) {
                const queryResult: IResponseJson = await executeQuery(`SELECT id, name FROM activities WHERE name='${activityName}' and user_id=${userID}`);
    
                if(queryResult.status) return {status: true, data: queryResult.data.length > 0 ? { activity: queryResult.data[0] }: null};
            }
    
            return {status: false, data: null};
        } catch(error: any) {
            console.error(error);
            return {status: false, data: null, message: error?.toString()};
        } finally {
            await disconnect();
        }
    }

    public async compareActivityIdAndUserID(activityID: number, userID: number): Promise<IResponseJson> {
        try {
            const connection: IResponseJson = await connect();
    
            if(connection.status) {
                const queryResult: IResponseJson = await executeQuery(`SELECT id FROM activities WHERE id=${activityID} and user_id=${userID}`);
    
                if(queryResult.status) return {status: true, data: queryResult.data.length > 0 ? true : false};
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
