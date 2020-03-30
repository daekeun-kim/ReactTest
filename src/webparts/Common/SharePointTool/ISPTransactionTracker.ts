import { ApiCommand } from "./ApiTransactionTracker";

export default interface ISPTransactionTracker {

    getTrackerSharePointSite():string
    getTargetSharepointSite():string;
    getApplicationName():string
    getTransactionName():string
    getSendToUserEmailWhenFail():string
    getSendToAdminEmailWhenFail():string
    getTrackerHeaderListName():string
    getTrackerDetailListName():string
    getTrackerHeaderId():string
    setTrackerHeaderListItemId(iListItemNumber:number):void
    
    createTrackerHeader():Promise<any>
    createTrackerDetails(api:ApiCommand):Promise<any>

    updateTrackerHeader(result:boolean):Promise<boolean>
    updateTrackerDetails(result:boolean,api:ApiCommand):Promise<any>

}