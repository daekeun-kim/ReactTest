import pnp  from "sp-pnp-js";

import { AbsISPTRansactionTracker } from "../../../Common/SPOTransactionTracker/AbsISPTransactionTracker";

export class TransactionInfo extends AbsISPTRansactionTracker {
    

    public _transationName : "Submit"|"Approve"|"Reject"|"";


    constructor(any){
        super(any);
        this._transationName = "" ;
    }
    
    getTimeOutMinutes(): number {
        return 1;        
    }

    getTargetSharepointSite(): string {

        return "https://klatencor.sharepoint.com/teams/dev_mirinae";      
        
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