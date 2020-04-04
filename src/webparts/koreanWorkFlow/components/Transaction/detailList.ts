import pnp  from "sp-pnp-js";
import { AbsSPTransaction } from "../../../Common/SPOTransactionTracker/AbsSPTransaction";
import { Person } from "../../../Common/SPOType/Person";

export class detailList extends AbsSPTransaction {




  Requestor: Person;
  RequestDate:Date
  headerID:string;
  test:string;


  constructor() {


    super();
       this.Requestor = new Person()
      , this.RequestDate = null
      , this.headerID = ""
      , this.test = "";
  }

  getListName(): string {

    return "RequestDetail";

  }
  getCalculatedMemeberFields(): string[] {
    return [];
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

getDateMemeberFields(): string[] {
    
    return ["RequestDate"];
}
getPersonMemeberFields(): string[] {
    return ["Requestor"];
}
getVirtualMemeberFields(): string[] {
    return [];
}
getFormID(){
    return this.headerID;
}

}