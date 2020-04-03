import pnp  from "sp-pnp-js";
import { AbsSPTransaction } from "../../../Common/SPOTransactionTracker/AbsSPTransaction";
import { Person } from "../../../Common/SPOType/Person";

export class headerList extends AbsSPTransaction {

  Title: string;
  headerID:string;
  requestor: Person;
  formID:string;  
  status:string;
  rqDate:Date
   
  constructor() {


    super();
    this.Title = ""    
      , this.headerID = ""
      , this.requestor = new Person()
      , this.formID = ""
      , this.status = ""
      , this.rqDate = null

  }

  getListName(): string {

    return "RequestHeader";

  }

getDateMemeberFields(): string[] {
    
    return ["rqDate"];
}
getPersonMemeberFields(): string[] {
    return ["requestor"];
}
getVirtualMemeberFields(): string[] {
    return [];
}
getFormID(){
    return this.headerID;
}

}