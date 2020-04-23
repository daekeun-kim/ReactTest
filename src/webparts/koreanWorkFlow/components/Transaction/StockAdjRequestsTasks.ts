import pnp  from "sp-pnp-js";
import { AbsSPTransaction } from "../../../Common/SPOTransactionTracker/AbsSPTransaction";
import { Person } from "../../../Common/SPOType/Person";

export class StockAdjRequestsTasks extends AbsSPTransaction {

  getMultiChoiceMemeberFields(): string[] {
    return [];
  }
  getLookupMemeberFields(): string[] {
    return [];
  }
  getMultiLookupMemeberFields(): string[] {
    return [];
  }
  getGroupMemeberFields(): string[] {
    return [];
  }
  getCalculatedMemeberFields(): string[] {
    return [];
  }

  Title: string;
  FormID: string;
  Request_x0020_Type: string;
  Request_x0020_ID: number;
  Request_x0020_Status: string;
  ApproverControl: string;
  Requestor: Person;
  Phase: number;
  Assigned_x0020_To: Person;
  Approval_x0020_Status: string;
  Assigned_x0020_Date: Date;
  Approved_x0020_User: Person;
  Approved_x0020_Date: Date;
  Approval_x0020_Comment: string;
  NextReminderDate: Date;
  Reason: string;
  SLOC: string;
  Step: number;
  AutoSkip: boolean;
  AutoSkipMsg: string;
  CC_Email: boolean;
  PreApprovalEmail:string;
  PostApprovedEmail:string;
  PostRejectedEmail:string;


  constructor() {


    super();
    this.Title = ""
      , this.FormID = ""
      , this.Request_x0020_Type = ""
      , this.Request_x0020_ID = 0
      , this.Request_x0020_Status = ""
      , this.ApproverControl = ""
      , this.Requestor = new Person()
      , this.Phase = 0
      , this.Assigned_x0020_To = new Person()
      , this.Approval_x0020_Status = ""
      , this.Approved_x0020_User = new Person()
      , this.Approval_x0020_Comment = ""
      , this.Reason = ""
      , this.Assigned_x0020_Date = null
      , this.Approved_x0020_Date = null
      , this.SLOC = ""
      , this.Step = 1
      , this.AutoSkip = false
      , this.AutoSkipMsg = ""
      , this.CC_Email = false
      , this.PreApprovalEmail = ""
      , this.PostApprovedEmail = ""
      , this.PostRejectedEmail = ""

  }

  getPrimaryMemeberFields(): string[] {
    return ["FormID","ApproverControl","Assigned_x0020_To"];
  }


  getListName(): string {

    return "StockAdjRequestsTasks";

  }

getDateMemeberFields(): string[] {
    
    return ["Assigned_x0020_Date","Approved_x0020_Date","NextReminderDate"];
}
getPersonMemeberFields(): string[] {
    return ["Requestor","Assigned_x0020_To","Approved_x0020_User"];
}
getVirtualMemeberFields(): string[] {
    return [];
}


getFormID(){
    return this.FormID;
}


}