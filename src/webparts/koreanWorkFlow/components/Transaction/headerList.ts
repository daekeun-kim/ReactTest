import pnp  from "sp-pnp-js";
import { AbsSPTransaction } from "../../../Common/SharePointTool/AbsSPTransaction";
import { Person } from "../../../Common/SharePointTool/Person";
import ITest from "../../../Common/SharePointTool/ITest";

export class headerList extends AbsSPTransaction {

  Title: string;
  headerID:string;
  requestor: Person;
  formID:string;  
  status:string;
  rqDate:Date

  constructor(any:ITest) {


    super();
    this.Title = ""    
      , this.headerID = ""
      , this.requestor = new Person()
      , this.formID = ""
      , this.status = ""
      , this.rqDate = null

      any.update()
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