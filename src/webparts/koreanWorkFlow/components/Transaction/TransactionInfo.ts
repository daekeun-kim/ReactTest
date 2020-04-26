import pnp  from "sp-pnp-js";

import { AbsISPTRansactionTracker } from "../../../Common/SPOTransactionTracker/AbsISPTransactionTracker";

export class TransactionInfo extends AbsISPTRansactionTracker {
    

    public _transationName : "Submit"|"Approve"|"Reject"|"";


    constructor(any){
        super(any);
        this._transationName = "" ;
    }
    
    getTimeOutMinutes(): number {
        return 10;        
    }

    getTrackerSharePointSite(): string {
        return "https://klatencor.sharepoint.com/teams/Dev_TransactionManager"
    }
    getApplicationName(): string {
        return "MirinaeTest"
    }
    getTransactionName(): string {
        return  this._transationName
    }
    getSendToUserEmailWhenFail(): string {
        return "daekeun.kim@kla-tencor.com";
    }
    getSendToAdminEmailWhenFail(): string {
        return "daekeun.kim@kla-tencor.com";
    }

}