import pnp, { ODataParserBase, AttachmentFileInfo, CamlQuery,Web, ItemAddResult, sp } from "sp-pnp-js";
import ISPTransactionTrackerHeader from "./ISPTransactionTrackerHeader";
import { Guid } from "@microsoft/sp-core-library";
import { ApiCommand } from "./ApiTransactionTracker";
import ITransactionProgressIndicator from "./ITransactionProgressIndicator";

export abstract class AbsISPTRansactionTracker implements ISPTransactionTrackerHeader {


    protected _trackerHeaderId:string;
    protected _trackerHeaderListItemId:number;
    protected _progressIndicator:ITransactionProgressIndicator
    protected _hasProgressIndicator:boolean;
    protected _completedSpoWebServiceCount:number;
    protected _totalSpoWebServiceCount:number;
    

    constructor(any){

        this._trackerHeaderId = Guid.newGuid().toString();
        this._progressIndicator = null;
        this._hasProgressIndicator = false;
        this._completedSpoWebServiceCount = 0;
        this._totalSpoWebServiceCount = 0;
    }

    abstract getTrackerSharePointSite(): string;
    abstract getApplicationName(): string;
    abstract getTransactionName(): string ;
    abstract getSendToUserEmailWhenFail():string;
    abstract getSendToAdminEmailWhenFail():string;
 
    setProgressIndicator(iProgressIndicator:ITransactionProgressIndicator){

        this._hasProgressIndicator = true;
        this._progressIndicator = iProgressIndicator;
    }

    removeProgressIndicator(){

        this._hasProgressIndicator = false;
        this._progressIndicator = null;
    }


    handleWhenStartTransaction(TotalTransactionCount: number,taskName?:string): void {

        if ( this._hasProgressIndicator === true){
            
            this._progressIndicator.handleProgressWhenStartTransaction(TotalTransactionCount,taskName);
        }
    }
    handleWhenCompletedCommand(CompletedTransactionCount: number, TotalTransactionCount: number,taskName?:string): void {

        if ( this._hasProgressIndicator === true){
            
            this._progressIndicator.handleProgressWhenCompletedCommand(CompletedTransactionCount,TotalTransactionCount,taskName);
        }
  
    }
    handleWhenFailedCommand(CompletedTransactionCount: number, TotalTransactionCount: number,taskName?:string): void {

        if ( this._hasProgressIndicator === true){
            
            this._progressIndicator.handleProgressWhenFailedCommand(CompletedTransactionCount,TotalTransactionCount,taskName);
        }

    }
    handleWhenCompletedTransation(TotalTransactionCount: number,taskName?:string): void {

        if ( this._hasProgressIndicator === true){
            
            this._progressIndicator.handleProgressWhenCompletedTransation(TotalTransactionCount,taskName);
        }
     
    }
    handleWhenFailedTransation(TotalTransactionCount: number,taskName?:string): void {

        if ( this._hasProgressIndicator === true){
            
            this._progressIndicator.handleProgressWhenFailedTransation(TotalTransactionCount,taskName);
        }

    }


    setTrackerHeaderListItemId(iListItemNumber:number){

        this._trackerHeaderListItemId = iListItemNumber;
    }

    setTotalSpoWebServiceCount(iTotalSpoWebServiceCount){
        this._totalSpoWebServiceCount = iTotalSpoWebServiceCount;
    }

    getTargetSharepointSite(): string {

        return pnp.sp.web.toUrl();      
        
    }

    getTrackerHeaderListName(): string {
        return "TransactionTrackerHeader"
    }
    getTrackerDetailListName(): string {
        return "TransactionTrackerDetails"
    }
    getTrackerHeaderId(): string {
        return this._trackerHeaderId;
    }
    createTrackerHeader(taskName?:string): Promise<any> {


        console.log("createTrackerHeader -- start");

        let trackerSite = this.getTrackerSharePointSite();
        let listName = this.getTrackerHeaderListName();
        let web = new Web(trackerSite);

        return web.lists.getByTitle(listName).items.add({
            Title:"test"
            ,TransactionID:this.getTrackerHeaderId()
            ,SharePointSite:this.getTargetSharepointSite()
            ,ApplicationName:this.getApplicationName()
            ,TransactionName:this.getTransactionName()
            ,SendToAdminEmailWhenFail:this.getSendToAdminEmailWhenFail()
            ,SendToUserEmailWhenFail:this.getSendToUserEmailWhenFail()
            ,Result:"wait"
        }).then((result:ItemAddResult)=>{
            console.log("createTrackerHeader -- end");
            this._completedSpoWebServiceCount++
            this.handleWhenCompletedCommand(this._completedSpoWebServiceCount,this._totalSpoWebServiceCount,taskName);
            return result;
        }).catch(error=>{
            this.handleWhenFailedCommand(this._completedSpoWebServiceCount,this._totalSpoWebServiceCount,taskName);
            return error;
        });

    }
    createTrackerDetails(api:ApiCommand,taskName?:string): Promise<any> {

        console.log("createTrackerDetails -- start");

        let trackerSite = this.getTrackerSharePointSite();
        let listName = this.getTrackerDetailListName();
        let web = new Web(trackerSite);

        return web.lists.getByTitle(listName).items.add({
            Title:"test"
            ,HeaderID:this.getTrackerHeaderId()
            ,CommandID:api.getCommandId()
            ,Seq:api.getSeq()
            ,SharepointSite:api.getTargetObj().getTargetSharepointSite()
            ,ListName:api.getTargetObj().getListName()
            ,CommandType:api.getCommandType()
            ,UndoType:api.getUndoType()
            ,RedoType:api.getRedoType()
            ,UndoValue:api.getTargetObj().getUndoValue()
            ,RedoValue:api.getTargetObj().getRedoValue()
            ,ListItemID:api.getTargetObj().getId()
            ,Result:"wait"

        }).then((result:ItemAddResult)=>{
            this._completedSpoWebServiceCount++
            this.handleWhenCompletedCommand(this._completedSpoWebServiceCount,this._totalSpoWebServiceCount,taskName);            
            console.log("createTrackerDetails -- end");            
            return result;
        }).catch(error=>{
            this.handleWhenFailedCommand(this._completedSpoWebServiceCount,this._totalSpoWebServiceCount,taskName);
            return error;
        });

    }
    updateTrackerHeader(result: boolean,taskName?:string): Promise<boolean> {

        console.log("updateTrackerHeader -- start");
        let trackerSite = this.getTrackerSharePointSite();
        let listName = this.getTrackerHeaderListName();
        let trackerHeaderId = this._trackerHeaderListItemId;
        let sResult = result === true? "success" : "failed";

        let web = new Web(trackerSite);


        return web.lists.getByTitle(listName).items.getById(trackerHeaderId).update({
            Result:sResult
        }).then(res=>{

            console.log("updateTrackerHeader -- end");
            this._completedSpoWebServiceCount++
            this.handleWhenCompletedCommand(this._completedSpoWebServiceCount,this._totalSpoWebServiceCount,taskName);
            return true;

        }).catch(error=>{
            this.handleWhenFailedCommand(this._completedSpoWebServiceCount,this._totalSpoWebServiceCount,taskName);
            return false;
        });
    }
    updateTrackerDetails(result: boolean, api:ApiCommand): Promise<any> {

        console.log("updateTrackerDetails -- start");
        let trackerSite = this.getTrackerSharePointSite();
        let listName = this.getTrackerDetailListName();
        let sResult = result === true? "success" : "failed";
        let web = new Web(trackerSite);
        let trackerDetailId = api.getTrackerDetailId();
        return web.lists.getByTitle(listName).items.getById(trackerDetailId).update({
            Result:sResult
        }).then(res=>{
            console.log("updateTrackerDetails -- end");
            return true;

        }).catch(error=>{

            return false;
        });
    }

}