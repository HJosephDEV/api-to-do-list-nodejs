import { IResponseJson } from "../../base/interfaces/response-json.interface";
import { IStoreActivityDTO } from "./store-activity.interface";
import { IUpdateActivityDTO } from "./update-activity.interface";

export interface IActivityService {
    createActivityService(activityParams: IStoreActivityDTO): Promise<IResponseJson>;
    deleteActivityService(id: number): Promise<IResponseJson>;
    findByIdActivityService(id: number): Promise<IResponseJson>;
    updateActivityService(activityParams: IUpdateActivityDTO): Promise<IResponseJson>
    findAllActivityService(id: number): Promise<IResponseJson>;
    findExistingNameActivityService(activityName: string): Promise<IResponseJson>;
    compareActivityIdAndUserID(activityID: number, userID: number): Promise<IResponseJson>;
}