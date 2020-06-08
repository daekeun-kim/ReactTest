import pnp  from "sp-pnp-js";
import { AbsSPTransaction } from "../../../Common/SPOTransactionTracker/AbsSPTransaction";
import { Person } from "../../../Common/SPOType/Person";

export class stockHeader extends AbsSPTransaction {


  Title: string;
  Request_x0020_Status:string;
  WarehouseUpdated:Date
  WarehouseUpdatedBy:Person


  constructor() {


    super();
    this.Title = ""      
      , this.Request_x0020_Status = ""
      , this.WarehouseUpdated = null
      , this.WarehouseUpdatedBy = new Person()
  }

  getPrimaryMemeberFields(): string[] {
    return ["Title"];
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

    return "StockAdjRequests";

  }

getDateMemeberFields(): string[] {
    
    return ["WarehouseUpdated"];
}
getPersonMemeberFields(): string[] {
    return ["WarehouseUpdatedBy"];
}
getVirtualMemeberFields(): string[] {
    return [];
}
getFormID(){
    return this.Title;
}

}