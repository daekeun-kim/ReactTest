import ISPTransactionCommand from "./ISPTransactionCommand";
import pnp, { ODataParserBase, AttachmentFileInfo, CamlQuery,Web, ItemAddResult, sp } from "sp-pnp-js";
import ISPTransactdion from "./ISPTransactionTracker";
import { Person } from "./Person";
import ISPTransactionTracker from "./ISPTransactionTracker";
import { Guid } from "@microsoft/sp-core-library";
import { ApiCommand } from "./ApiTransactionTracker";

export abstract class AbsISPTRansactionTracker implements ISPTransactionTracker {


    protected _trackerHeaderId:string;
    protected _trackerHeaderListItemId:number;
    

    constructor(any){

        this._trackerHeaderId = Guid.newGuid().toString();
    }

    abstract getTrackerSharePointSite(): string;
    abstract getApplicationName(): string;
    abstract getTransactionName(): string ;
    abstract getSendToUserEmailWhenFail():string;
    abstract getSendToAdminEmailWhenFail():string;

    setTrackerHeaderListItemId(iListItemNumber:number){

        this._trackerHeaderListItemId = iListItemNumber;
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
    createTrackerHeader(): Promise<any> {


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
            return result;
        }).catch(error=>{
            return error;
        });

    }
    createTrackerDetails(api:ApiCommand): Promise<any> {

        console.log("createTrackerHeader -- start");

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
            console.log("createTrackerDetails -- end");

            return result;
        }).catch(error=>{
            return error;
        });

    }
    updateTrackerHeader(result: boolean): Promise<boolean> {

        console.log("updateTrackerHeader -- start");
        let trackerSite = this.getTrackerSharePointSite();
        let listName = this.getTrackerHeaderListName();
        let trackerHeaderId = this._trackerHeaderListItemId;
        let web = new Web(trackerSite);

        return web.lists.getByTitle(listName).items.getById(trackerHeaderId).update({
            Result:"success"
        }).then(res=>{

            console.log("updateTrackerHeader -- end");
            return true;

        }).catch(error=>{

            return false;
        });
    }
    updateTrackerDetails(result: boolean, api:ApiCommand): Promise<any> {

        console.log("updateTrackerDetails -- start");
        let trackerSite = this.getTrackerSharePointSite();
        let listName = this.getTrackerDetailListName();
        let web = new Web(trackerSite);
        let trackerDetailId = api.getTrackerDetailId();
        return web.lists.getByTitle(listName).items.getById(trackerDetailId).update({
            Result:"success"
        }).then(res=>{
            console.log("updateTrackerDetails -- end");
            return true;

        }).catch(error=>{

            return false;
        });
    }

}