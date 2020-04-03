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
    
    createTrackerHeader():Promise<any>
    createTrackerDetails(api:ApiCommand):Promise<any>

    updateTrackerHeader(result:boolean):Promise<boolean>
    updateTrackerDetails(result:boolean,api:ApiCommand):Promise<any>

    handleWhenStartTransaction(TotalTransactionCount:number):void;
    handleWhenCompletedCommand(CompletedTransactionCount:number,TotalTransactionCount:number):void;
    handleWhenFailedCommand(CompletedTransactionCount:number,TotalTransactionCount:number):void;    
    handleWhenCompletedTransation(TotalTransactionCount:number):void;
    handleWhenFailedTransation(TotalTransactionCount:number):void;

}