import { Request, Response } from 'express';

import { IActivityController } from './interfaces/activity-controller.interface';
import { ActivityService } from './activity.service';
import { IStoreActivityDTO } from './interfaces/store-activity.interface';
import { IResponseJson } from '../base/interfaces/response-json.interface';
import { IUpdateActivityDTO } from './interfaces/update-activity.interface';

export class ActivityController extends ActivityService implements IActivityController {
    
    constructor() {
        super();
    }

    public async createActivity(req: Request, res: Response): Promise<void> {
        try {
            const userID: number = Number(req.headers['user-id'])
            const activity: IStoreActivityDTO = {...req.body, userID};

            if(activity) {
                const activityExists: IResponseJson = await super.findExistingNameActivityService(activity.name, userID);
                
                if(activityExists.status && !activityExists.data) {
                    const result: IResponseJson = await super.createActivityService(activity);
        
                    if(result.status) {
                        res.status(200);
                        res.send("Activity successfully registered!");
                    } else {
                        res.status(400);
                        res.json(result?.message);
                    }
                } else if(activityExists.status && activityExists.data) {
                    res.status(400);
                    res.send("Activity name already registered!")
                    throw Error("Activity name already registered!");
                } else {
                    res.status(400);
                    res.send(activityExists?.message)
                }
            }
        } catch(error:any) {
            console.error(error);
        }
    }

    public async deleteActivity(req: Request, res: Response): Promise<void> {
        try {
            const id: number = Number(req.params.id);
            const userID: number = Number(req.headers['user-id']);
            const permission: IResponseJson = await super.compareActivityIdAndUserID(id, userID);
            
            if(permission.data) {
                if(id) {
                    const idExists: IResponseJson = await super.findByIdActivityService(id);
        
                    if(idExists.status && idExists.data) {
                        const result: IResponseJson = await super.deleteActivityService(id);
                
                        if(result.status) {
                            res.status(200);
                            res.send("Activity deleted successfully!");
                        } else {
                            res.status(400);
                            res.json(result?.message);
                        }
                    } else if(idExists.status && !idExists.data) {
                        res.status(404);
                        res.send("Activity not found!")
                        throw Error("Activity not found!") 
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

    public async findActivity(req: Request, res: Response): Promise<void> {
        try {
            const id: number = Number(req.params.id);
            const userID: number = Number(req.headers['user-id']);
            const permission: IResponseJson = await super.compareActivityIdAndUserID(id, userID);

            if(permission.data) {
                if(id) {
                    const result: IResponseJson = await super.findByIdActivityService(id);
    
                    if(result.status && result.data) {
                        res.status(200);
                        res.json({status: 200, data: result.data});
                    } else if(result.status && !result.data) {
                        res.status(404);
                        res.json("Activity not found!");
                        throw Error("Activity not found!") 
                    } else {
                        res.status(400);
                        res.json(result?.message);
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

    public async findPerPageActivities(req: Request, res: Response): Promise<void> {
        try {
            const userID: number = Number(req.headers['user-id'])
            const page: number = Number(req.query.page || 1)
            const limit: number = Number(req.query.limit || 0)
            const resultsPerPage: number = 15

            // temporário
            if(limit > 1) {
                const resultActivityByLimit: IResponseJson = await super.findAlreadyPaginatedPagesActivityService(userID, limit)
                if(resultActivityByLimit.status) {
                    res.status(200);
                    res.json({status: 200, data: {activities: resultActivityByLimit.data}});

                    return
                } else { 
                    res.status(400);
                    res.json(resultActivityByLimit?.message);

                    return
                }
            }

            if (page <= 0) {
              res.status(400)
              res.json({ error: 'Invalid page!' });

              return
            }
            
            const totalResults: IResponseJson = await super.findQuantityActivityService(userID)
            const totalPages = Math.ceil(totalResults.data / resultsPerPage);

            if (page > totalPages) {
              res.status(404)
              res.json({ error: 'Page not found!"' });

              return 
            }

            const offset = page > 1 ? (page - 1) * resultsPerPage : resultsPerPage;

            const result: IResponseJson = await super.findPerPageActivityService(userID, resultsPerPage, offset);

            if(result.status) {
                res.status(200);
                res.json({status: 200, data: {activities: result.data, page: page, totalPages: totalPages}});
            } else { 
                res.status(400);
                res.json(result?.message);
            }
        } catch(error: any) {
            console.error(error);
        }
    }

    public async updateActivity(req: Request, res: Response): Promise<void> {
        try {
            const id: number = Number(req.params.id);
            const activity: IUpdateActivityDTO = {...req.body, id};
            const userID: number = Number(req.headers['user-id']);
            const permission: IResponseJson = await super.compareActivityIdAndUserID(activity.id, userID);

            if(permission.data) {
                if(activity) {
                    const idExists: IResponseJson = await super.findByIdActivityService(activity.id);
        
                    if(idExists.status && idExists.data) {
                       
                        const result: IResponseJson = await super.updateActivityService(activity);
            
                        if(result.status) {
                            res.status(200);
                            res.json({success:1});
                        } else {
                            res.status(400);
                            res.json(result?.message);
                        }
                    } else if(idExists.status && !idExists.data) {
                        res.status(404);
                        res.json("Activity not found!");
                        throw Error("Activity not found!") 
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
}