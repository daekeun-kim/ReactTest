import pnp  from "sp-pnp-js";
import { AbsSPTransaction } from "../../../Common/SharePointTool/AbsSPTransaction";
import { Person } from "../../../Common/SharePointTool/Person";

export class detailList extends AbsSPTransaction {

  Title: string;
  Requestor: Person;
  RequestDate:Date
  headerID:string;


  constructor() {


    super();
    this.Title = ""
      , this.Requestor = new Person()
      , this.RequestDate = null
      , this.headerID = ""
  }

  getListName(): string {

    return "RequestDetail";

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