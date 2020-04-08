import { ApiCommand } from "./ApiTransactionTracker";

export default interface ISPTransactionTrackerHeader {

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
    setTotalSpoWebServiceCount(iTotalSpoWebServiceCount:number):void
    
    createTrackerHeader(taskName?:string):Promise<any>
    createTrackerDetails(api:ApiCommand,taskName?:string):Promise<any>

    updateTrackerHeader(result:boolean,taskName?:string):Promise<boolean>
    updateTrackerDetails(result:boolean,api:ApiCommand,taskName?:string):Promise<any>

    handleWhenStartTransaction(TotalTransactionCount:number,taskName?:string):void;
    handleWhenCompletedCommand(CompletedTransactionCount:number,TotalTransactionCount:number,taskName?:string):void;
    handleWhenFailedCommand(CompletedTransactionCount:number,TotalTransactionCount:number,taskName?:string):void;    
    handleWhenCompletedTransation(TotalTransactionCount:number,taskName?:string):void;
    handleWhenFailedTransation(TotalTransactionCount:number,taskName?:string):void;

}