import pnp  from "sp-pnp-js";
import { AbsSPTransaction } from "../../../Common/SPOTransactionTracker/AbsSPTransaction";
import { Person } from "../../../Common/SPOType/Person";

export class TaskList extends AbsSPTransaction {

  Title: string;  
  FormID:string;
  ApproverControl:string;
  Phase:number;
  Step:number;
  Assigned_x0020_To:Person;


  constructor() {


    super();
    this.Title = ""
      this.FormID =""
      , this.ApproverControl = ""
      , this.Phase = null
      , this.Step = null
      , this.Assigned_x0020_To = new Person()            
      
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
    return [];
  }
  getCalculatedMemeberFields(): string[] {
    return [];
  }
  getListName(): string {

    return "StockAdjRequestsTasks";

  }

getDateMemeberFields(): string[] {
    
    return [];
}
getPersonMemeberFields(): string[] {
    return ["Assigned_x0020_To"];
}
getVirtualMemeberFields(): string[] {
    return [];
}
getFormID(){
    return this.Title;
}

}