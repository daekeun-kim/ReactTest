import pnp  from "sp-pnp-js";
import { AbsSPTransaction } from "../../../Common/SPOTransactionTracker/AbsSPTransaction";
import { Person } from "../../../Common/SPOType/Person";
import { detailList } from "./detailList";
import { LookUp } from "../../../Common/SPOType/LookUp";

type Choice2 = "Test1"|"Test2"|"Test3"|"";

export class headerList extends AbsSPTransaction {


  headerID:string;
  requestor: Person;
  formID:string;  
  status:string;
  rqDate:Date;
  Choice1:Choice2[];
  Choice2:Choice2;
  lookup1:LookUp;
  lookup2:LookUp[];
  group:Person[];
   
  constructor() {


    super();   
       this.headerID = ""
      , this.requestor = new Person()
      , this.formID = ""
      , this.status = ""
      , this.rqDate = null
      , this.Choice2 = null
      , this.Choice1 = []
      , this.group = [] as Person[]
      , this.lookup1 = new LookUp()
      , this.lookup2 = [] as LookUp[]

  }

  getMultiChoiceMemeberFields(): string[] {
    return ["Choice1"];
  }
  getLookupMemeberFields(): string[] {
    return ["lookup1"];
  }
  getMultiLookupMemeberFields(): string[] {
    return ["lookup2"];
  }
  getGroupMemeberFields(): string[] {
    return ["group"];
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