import pnp  from "sp-pnp-js";
import { AbsSPTransaction } from "../../../Common/SPOTransactionTracker/AbsSPTransaction";
import { Person } from "../../../Common/SPOType/Person";

export class PartList extends AbsSPTransaction {

  Title: string;
  Part_x0020_No:string;
  DR_x0020_QTY:number;


  constructor() {


    super();
    this.Title = ""      
      , this.Part_x0020_No = ""
      , this.DR_x0020_QTY = 0
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
  getListName(): string {

    return "StockAdjRequestsParts";

  }

getDateMemeberFields(): string[] {
    
    return [];
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