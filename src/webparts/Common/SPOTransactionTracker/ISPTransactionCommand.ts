export default interface ISPTransactionCommand {

    beforeAdd():boolean;
    afterAdd(result:any):boolean;
    errorWhenAdd(error:any):void;

    beforeUpdate():boolean;
    afterUpdate(result:any):boolean;
    errorWhenUpdate(error:any):void;

    beforeDelete():boolean;
    afterDelete(result:any):boolean;
    errorWhenDelete(error:any):void;

    getListName():string;    
    getId():number;
    getFormID():string;

    getTargetObjForAdd():any;
    getTargetObjForUpdate():any;

    
    getDateMemeberFields():string[];
    getCalculatedMemeberFields():string[];
    getPersonMemeberFields():string[];
    getGroupMemeberFields():string[];
    getLookupMemeberFields():string[];
    getMultiLookupMemeberFields():string[];
    getMultiChoiceMemeberFields():string[];
    getVirtualMemeberFields():string[];

    LoadQuery(filterString?:string):any;    
    beforeLoad():boolean;
    onCompletedLoad():Promise<any>; // when single item has been completed to load
    afterLoad(result:any):boolean; // when all the item has been retrieved
    errorWhenLoad(error:any):void;

    getTargetSharepointSite():string;
    getResult():boolean;

    getUndoValue():string;
    getRedoValue():string;

    setRedoValue(targetObj:any);

    customQuery(iFilterString?:string):any


}