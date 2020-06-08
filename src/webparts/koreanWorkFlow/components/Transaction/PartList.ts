import pnp  from "sp-pnp-js";
import { AbsSPTransaction } from "../../../Common/SPOTransactionTracker/AbsSPTransaction";
import { Person } from "../../../Common/SPOType/Person";

export class PartList extends AbsSPTransaction {


  Title: string;
  Part_x0020_No:string;
  DR_x0020_QTY:number;
  Requested_x0020_Date:Date;
  Status:string;
  Assigned_x0020_Approvers:Person[];
  WH_x0020_Approved_x0020_Date:Date

  constructor() {

    super();
    this.Title = ""      
      , this.Part_x0020_No = ""
      , this.Requested_x0020_Date = null
      , this.Status = ""
      , this.DR_x0020_QTY = null
      , this.Assigned_x0020_Approvers = []
      , this.WH_x0020_Approved_x0020_Date = null
  }

  getPrimaryMemeberFields(): string[] {
    return ["Title","Part_x0020_No"];
  }

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
    return ["Assigned_x0020_Approvers"];
  }
  getCalculatedMemeberFields(): string[] {
    return [];
  }
  getListName(): string {

    return "StockAdjRequestsParts";

  }

getDateMemeberFields(): string[] {
    
    return ["WH_x0020_Approved_x0020_Date"];
}
getPersonMemeberFields(): string[] {
    return [];
}
getVirtualMemeberFields(): string[] {
    return [];
}
getFormID(){
    return this.Title;
}

}